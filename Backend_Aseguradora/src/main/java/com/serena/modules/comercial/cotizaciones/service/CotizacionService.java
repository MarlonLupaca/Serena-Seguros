package com.serena.modules.comercial.cotizaciones.service;

import com.serena.modules.comercial.cotizaciones.dto.AsignarAgenteRequest;
import com.serena.modules.comercial.cotizaciones.dto.CambioEstadoCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.ContratarCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.GuardarCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionResponse.PlanSimulado;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
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

    @Transactional
    public CotizacionResponse crear(Usuario usuario, CrearCotizacionRequest request) {
        Empleado agente = agenteDisponible();

        BigDecimal prima = request.primaEstimada();
        if (prima == null && request.idProducto() != null) {
            ProductoSeguro p = productoRepository.findById(request.idProducto()).orElse(null);
            if (p != null) prima = p.getPrimaBase();
        }

        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .productoInteres(request.productoInteres())
                .estadoKanban(LeadCotizacion.EstadoKanban.NUEVO)
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
        BigDecimal factorEdad = factorPorEdad(request.edad());
        BigDecimal factorMonto = factorPorMonto(request.montoAsegurado());

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
        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .productoInteres(request.productoInteres())
                .estadoKanban(LeadCotizacion.EstadoKanban.EN_PROPUESTA)
                .primaEstimada(request.primaEstimada())
                .build();
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    @Transactional
    public CotizacionResponse contratar(Usuario usuario, Integer idCotizacion, ContratarCotizacionRequest request) {
        LeadCotizacion lead = cotizacionRepository.findById(idCotizacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", idCotizacion));

        Cliente cliente = clienteDelUsuario(usuario);
        ProductoSeguro producto = productoRepository.findById(request.idProducto())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", request.idProducto()));

        BigDecimal prima = lead.getPrimaEstimada() != null
                ? lead.getPrimaEstimada()
                : producto.getPrimaBase();

        Poliza poliza = Poliza.builder()
                .cliente(cliente)
                .producto(producto)
                .primaTotal(prima)
                .estadoPoliza(Poliza.EstadoPoliza.PENDIENTE)
                .vigenciaInicio(LocalDate.now().plusDays(1))
                .vigenciaFin(LocalDate.now().plusDays(1).plusYears(1))
                .build();
        polizaRepository.save(poliza);

        lead.setEstadoKanban(LeadCotizacion.EstadoKanban.GANADO);
        return CotizacionResponse.from(cotizacionRepository.save(lead));
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

    private BigDecimal factorPorEdad(Integer edad) {
        if (edad == null) return BigDecimal.ONE;
        if (edad < 25) return new BigDecimal("1.20");
        if (edad < 40) return new BigDecimal("1.00");
        if (edad < 60) return new BigDecimal("1.15");
        return new BigDecimal("1.40");
    }

    private BigDecimal factorPorMonto(BigDecimal monto) {
        if (monto == null) return BigDecimal.ONE;
        if (monto.compareTo(new BigDecimal("10000")) < 0) return new BigDecimal("0.80");
        if (monto.compareTo(new BigDecimal("50000")) < 0) return BigDecimal.ONE;
        if (monto.compareTo(new BigDecimal("100000")) < 0) return new BigDecimal("1.25");
        return new BigDecimal("1.60");
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
}
