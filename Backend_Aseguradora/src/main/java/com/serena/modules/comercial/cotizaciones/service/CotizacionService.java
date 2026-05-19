package com.serena.modules.comercial.cotizaciones.service;

import com.serena.modules.comercial.cotizaciones.dto.AceptarPropuestaRequest;
import com.serena.modules.comercial.cotizaciones.dto.AsignarAgenteRequest;
import com.serena.modules.comercial.cotizaciones.dto.CambioEstadoCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.ContratacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.ContratarCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.GuardarCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionResponse.PlanSimulado;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import com.serena.modules.comercial.propuestas.repository.PropuestaPolizaRepository;
import com.serena.modules.comercial.suscripcion.service.CalculadoraPrimaService;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.core.polizas.service.PolizaService;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CotizacionService {

    private final LeadCotizacionRepository cotizacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;
    private final ProductoSeguroRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final PolizaRepository polizaRepository;
    private final PropuestaPolizaRepository propuestaRepository;
    private final PolizaService polizaService;
    private final CalculadoraPrimaService calculadora;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;

    @Transactional
    public CotizacionResponse crear(Usuario usuario, CrearCotizacionRequest request) {
        Empleado agente = agenteDisponible();
        Cliente cliente = clienteOpcional(usuario);
        ProductoSeguro producto = request.idProducto() != null
                ? productoRepository.findById(request.idProducto()).orElse(null)
                : null;

        BigDecimal prima = request.primaEstimada();
        if (prima == null && producto != null) prima = producto.getPrimaBase();

        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .cliente(cliente)
                .producto(producto)
                .productoInteres(request.productoInteres())
                .estadoKanban(LeadCotizacion.EstadoKanban.NUEVO)
                .tipoOrigen(LeadCotizacion.TipoOrigen.NUEVA)
                .primaEstimada(prima)
                .build();
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    @Transactional(readOnly = true)
    public SimulacionResponse simular(SimulacionRequest request) {
        ProductoSeguro.TipoSeguro tipo = ProductoSeguro.TipoSeguro.valueOf(request.productoInteres().name());
        ProductoSeguro producto = productoRepository.findByEstadoAndTipoSeguro(
                        ProductoSeguro.Estado.ACTIVO, tipo)
                .stream()
                .findFirst()
                .orElseGet(() -> productoRepository.findByTipoSeguro(tipo).stream().findFirst().orElse(null));

        BigDecimal base = producto != null ? producto.getPrimaBase() : new BigDecimal("500.00");
        BigDecimal factorEdad = calculadora.factorPorEdad(request.edad());
        BigDecimal factorMonto = calculadora.factorPorMonto(request.montoAsegurado());

        BigDecimal primaBase = base.multiply(factorEdad).multiply(factorMonto)
                .setScale(2, RoundingMode.HALF_UP);

        PlanSimulado basico = plan(
                "BASICO",
                "Plan Basico",
                primaBase,
                primaBase.multiply(new BigDecimal("60")),
                new BigDecimal("300.00"),
                List.of("Cobertura esencial", "Atencion 24/7", "Asistencia basica")
        );
        PlanSimulado intermedio = plan(
                "INTERMEDIO",
                "Plan Intermedio",
                primaBase.multiply(new BigDecimal("1.5")).setScale(2, RoundingMode.HALF_UP),
                primaBase.multiply(new BigDecimal("90")),
                new BigDecimal("200.00"),
                List.of("Cobertura ampliada", "Atencion 24/7", "Asistencia en viaje", "Servicios complementarios")
        );
        PlanSimulado premium = plan(
                "PREMIUM",
                "Plan Premium",
                primaBase.multiply(new BigDecimal("2.2")).setScale(2, RoundingMode.HALF_UP),
                primaBase.multiply(new BigDecimal("130")),
                new BigDecimal("100.00"),
                List.of("Cobertura completa", "Atencion preferente", "Asistencia internacional", "Servicios premium", "Sin copagos")
        );

        return new SimulacionResponse(
                request.productoInteres().name(),
                request.edad(),
                request.montoAsegurado(),
                request.ubicacion(),
                List.of(basico, intermedio, premium)
        );
    }

    @Transactional
    public CotizacionResponse guardar(Usuario usuario, GuardarCotizacionRequest request) {
        Empleado agente = agenteDisponible();
        Cliente cliente = clienteOpcional(usuario);
        ProductoSeguro producto = request.idProducto() != null
                ? productoRepository.findById(request.idProducto()).orElse(null)
                : null;
        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .cliente(cliente)
                .producto(producto)
                .productoInteres(request.productoInteres())
                .estadoKanban(LeadCotizacion.EstadoKanban.EN_PROPUESTA)
                .tipoOrigen(LeadCotizacion.TipoOrigen.NUEVA)
                .primaEstimada(request.primaEstimada())
                .build();
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    /**
     * @deprecated reemplazado por el flujo evaluacion -> propuesta -> aceptar.
     * Mantenido para no romper integraciones antiguas; delega a {@link #aceptar}
     * cuando ya existe una propuesta vigente.
     */
    @Deprecated
    @Transactional
    public ContratacionResponse contratar(Usuario usuario, Integer idCotizacion, ContratarCotizacionRequest request) {
        LeadCotizacion lead = buscar(idCotizacion);
        ProductoSeguro producto = request.idProducto() != null
                ? productoRepository.findById(request.idProducto())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Producto", request.idProducto()))
                : lead.getProducto();
        if (producto == null) {
            throw new IllegalStateException("La cotizacion no tiene producto y la solicitud no provee id_producto");
        }
        Cliente cliente = clienteDelUsuario(usuario);
        BigDecimal prima = lead.getPrimaEstimada() != null ? lead.getPrimaEstimada() : producto.getPrimaBase();

        Poliza poliza = Poliza.builder()
                .cliente(cliente)
                .producto(producto)
                .primaTotal(prima)
                .estadoPoliza(Poliza.EstadoPoliza.PENDIENTE)
                .vigenciaInicio(LocalDate.now().plusDays(1))
                .vigenciaFin(LocalDate.now().plusDays(1).plusYears(1))
                .build();
        Poliza guardada = polizaRepository.save(poliza);
        lead.setEstadoKanban(LeadCotizacion.EstadoKanban.GANADO);
        cotizacionRepository.save(lead);
        return new ContratacionResponse(
                lead.getIdCotizacion(),
                guardada.getIdPoliza(),
                guardada.getEstadoPoliza().name(),
                guardada.getPrimaTotal(),
                guardada.getVigenciaInicio(),
                guardada.getVigenciaFin()
        );
    }

    /**
     * Acepta la propuesta vigente y emite la poliza en estado PENDIENTE.
     * La poliza se activa al pagar la primera cuota (ver CuotaService).
     */
    @Transactional
    public ContratacionResponse aceptar(Usuario usuario, Integer idCotizacion, AceptarPropuestaRequest request) {
        LeadCotizacion lead = buscar(idCotizacion);
        PropuestaPoliza propuesta = propuestaRepository.findFirstByCotizacionOrderByFechaEmisionDesc(lead)
                .orElseThrow(() -> new IllegalStateException(
                        "No existe propuesta vigente para la cotizacion " + idCotizacion));
        if (propuesta.getEstado() != PropuestaPoliza.Estado.EMITIDA) {
            throw new IllegalStateException(
                    "La propuesta debe estar EMITIDA para aceptarse. Estado actual: " + propuesta.getEstado());
        }
        if (propuesta.getValidaHasta().isBefore(LocalDate.now())) {
            propuesta.setEstado(PropuestaPoliza.Estado.EXPIRADA);
            propuestaRepository.save(propuesta);
            throw new IllegalStateException("La propuesta expiro el " + propuesta.getValidaHasta());
        }
        if (!request.aceptaTerminos() || !request.declaracionVeraz()) {
            throw new IllegalArgumentException("Debe aceptar terminos y declarar veracidad");
        }

        Cliente cliente = clienteDelUsuario(usuario);
        Poliza polizaPadre = lead.getPolizaOrigen();
        Poliza poliza = polizaService.crearDesdePropuesta(propuesta, cliente, polizaPadre);

        propuesta.setEstado(PropuestaPoliza.Estado.ACEPTADA);
        propuesta.setFechaAceptacion(java.time.LocalDateTime.now());
        propuestaRepository.save(propuesta);

        lead.setEstadoKanban(LeadCotizacion.EstadoKanban.GANADO);
        cotizacionRepository.save(lead);

        auditoriaService.registrar("ACEPTAR_PROPUESTA", "COMERCIAL",
                "Propuesta " + propuesta.getIdPropuesta() + " aceptada y poliza " + poliza.getIdPoliza() + " emitida");
        notificacionService.crear(usuario, Notificacion.Tipo.GENERAL,
                "Tu poliza fue emitida",
                "Pendiente de activacion: paga la primera cuota para activar la cobertura",
                "/asegurado/polizas");

        return new ContratacionResponse(
                lead.getIdCotizacion(),
                poliza.getIdPoliza(),
                poliza.getEstadoPoliza().name(),
                poliza.getPrimaTotal(),
                poliza.getVigenciaInicio(),
                poliza.getVigenciaFin()
        );
    }

    /**
     * Inicia el flujo de renovacion sobre una poliza existente.
     * Crea un lead con tipo_origen=RENOVACION; el resto del flujo
     * (evaluacion, propuesta, aceptar, pagar) reutiliza los endpoints habituales.
     */
    @Transactional
    public CotizacionResponse renovar(Usuario usuario, Integer idPoliza) {
        Poliza padre = polizaService.obtenerEntidadPropia(usuario, idPoliza);
        LocalDate hoy = LocalDate.now();
        boolean elegible = (padre.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA
                && !padre.getVigenciaFin().isAfter(hoy.plusDays(60)))
                || (padre.getEstadoPoliza() == Poliza.EstadoPoliza.VENCIDA
                && !padre.getVigenciaFin().isBefore(hoy.minusDays(90)));
        if (!elegible) {
            throw new IllegalStateException(
                    "Solo puedes renovar polizas activas proximas a vencer o vencidas hace menos de 90 dias");
        }
        Empleado agente = agenteDisponible();
        Cliente cliente = padre.getCliente();
        ProductoSeguro producto = padre.getProducto();
        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .cliente(cliente)
                .producto(producto)
                .productoInteres(LeadCotizacion.ProductoInteres.valueOf(producto.getTipoSeguro().name()))
                .estadoKanban(LeadCotizacion.EstadoKanban.NUEVO)
                .tipoOrigen(LeadCotizacion.TipoOrigen.RENOVACION)
                .polizaOrigen(padre)
                .primaEstimada(padre.getPrimaTotal())
                .build();
        LeadCotizacion guardado = cotizacionRepository.save(lead);
        auditoriaService.registrar("INICIAR_RENOVACION", "COMERCIAL",
                "Lead " + guardado.getIdCotizacion() + " de renovacion de poliza " + padre.getIdPoliza());
        return CotizacionResponse.from(guardado);
    }

    @Transactional(readOnly = true)
    public List<CotizacionResponse> listar(LeadCotizacion.EstadoKanban estado, Boolean soloMias, Usuario usuario) {
        Empleado agenteActual = soloMias != null && soloMias
                ? empleadoActual(usuario)
                : null;

        List<LeadCotizacion> leads;
        if (agenteActual != null && estado != null) {
            leads = cotizacionRepository.findByEmpleadoAgenteAndEstadoKanbanOrderByFechaIngresoDesc(agenteActual, estado);
        } else if (agenteActual != null) {
            leads = cotizacionRepository.findByEmpleadoAgenteOrderByFechaIngresoDesc(agenteActual);
        } else if (estado != null) {
            leads = cotizacionRepository.findByEstadoKanbanOrderByFechaIngresoDesc(estado);
        } else {
            leads = cotizacionRepository.findAllByOrderByFechaIngresoDesc();
        }
        return leads.stream().map(CotizacionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CotizacionResponse obtener(Integer id) {
        return CotizacionResponse.from(buscar(id));
    }

    @Transactional
    public CotizacionResponse cambiarEstado(Integer id, CambioEstadoCotizacionRequest request) {
        LeadCotizacion lead = buscar(id);
        lead.setEstadoKanban(request.estadoKanban());
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    @Transactional
    public CotizacionResponse asignarAgente(Integer id, AsignarAgenteRequest request) {
        LeadCotizacion lead = buscar(id);
        Empleado agente = empleadoRepository.findById(request.idEmpleadoAgente())
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado", request.idEmpleadoAgente()));
        lead.setEmpleadoAgente(agente);
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    private PlanSimulado plan(String nivel, String nombre, BigDecimal mensual, BigDecimal anual,
                              BigDecimal deducible, List<String> beneficios) {
        BigDecimal cobertura = mensual.multiply(new BigDecimal("60"));
        return new PlanSimulado(nivel, nombre, mensual,
                anual.setScale(2, RoundingMode.HALF_UP),
                cobertura.setScale(2, RoundingMode.HALF_UP),
                deducible, beneficios);
    }

    private Empleado agenteDisponible() {
        return empleadoRepository.findAll().stream()
                .filter(e -> "COMERCIAL".equalsIgnoreCase(e.getArea()))
                .findFirst()
                .or(() -> empleadoRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Empleado disponible para asignar cotizacion", 0));
    }

    private LeadCotizacion buscar(Integer id) {
        return cotizacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", id));
    }

    private Empleado empleadoActual(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(empleadoRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado del usuario", usuario.getIdUsuario()));
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }

    private Cliente clienteOpcional(Usuario usuario) {
        if (usuario == null) return null;
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElse(null);
    }
}
