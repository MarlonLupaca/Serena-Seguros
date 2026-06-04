package com.serena.modules.tecnico.siniestros.service;

import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.soporte.auditoria.entity.AuditoriaAccion;
import com.serena.modules.soporte.auditoria.repository.AuditoriaRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.modules.tecnico.documentos.dto.DocumentoResponse;
import com.serena.modules.tecnico.documentos.service.DocumentoService;
import com.serena.modules.tecnico.siniestros.dto.AsignarAnalistaRequest;
import com.serena.modules.tecnico.siniestros.dto.CambioEstadoSiniestroRequest;
import com.serena.modules.tecnico.siniestros.dto.CrearSiniestroRequest;
import com.serena.modules.tecnico.siniestros.dto.PeritoObservacionRequest;
import com.serena.modules.tecnico.siniestros.dto.SiniestroAdminResponse;
import com.serena.modules.tecnico.siniestros.dto.SiniestroDetalleResponse;
import com.serena.modules.tecnico.siniestros.dto.SiniestroDetalleResponse.EventoTimeline;
import com.serena.modules.tecnico.siniestros.dto.SiniestroResponse;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiniestroService {

    private final SiniestroRepository siniestroRepository;
    private final PolizaRepository polizaRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;
    private final AuditoriaService auditoria;
    private final AuditoriaRepository auditoriaRepository;
    private final NotificacionService notificaciones;
    private final DocumentoService documentoService;

    @Transactional(readOnly = true)
    public List<SiniestroResponse> misSiniestros(Usuario usuario) {
        Cliente cliente = clienteDelUsuario(usuario);
        return siniestroRepository
                .findByPolizaClienteOrderByFechaReporteDesc(cliente)
                .stream()
                .map(SiniestroResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SiniestroDetalleResponse miSiniestro(Usuario usuario, Integer idSiniestro) {
        Cliente cliente = clienteDelUsuario(usuario);
        Siniestro siniestro = siniestroRepository.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        if (!siniestro.getPoliza().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("El siniestro no pertenece al usuario");
        }
        List<EventoTimeline> timeline = construirTimeline(siniestro);
        List<DocumentoResponse> documentos = documentoService
                .listarPorReferencia("siniestro", siniestro.getIdSiniestro());
        return new SiniestroDetalleResponse(
                siniestro.getIdSiniestro(),
                siniestro.getPoliza().getIdPoliza(),
                siniestro.getPoliza().getProducto().getNombre(),
                siniestro.getPoliza().getProducto().getTipoSeguro().name(),
                siniestro.getTipoIncidente(),
                siniestro.getDescripcion(),
                siniestro.getFechaOcurrencia(),
                siniestro.getFechaReporte(),
                siniestro.getEstadoResolucion().name(),
                siniestro.getMontoReclamado(),
                timeline,
                documentos
        );
    }

    @Transactional
    public SiniestroResponse reportar(Usuario usuario, CrearSiniestroRequest request) {
        Cliente cliente = clienteDelUsuario(usuario);
        Poliza poliza = polizaRepository.findById(request.getIdPoliza())
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", request.getIdPoliza()));
        if (!poliza.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La poliza no pertenece al usuario");
        }
        Siniestro siniestro = Siniestro.builder()
                .poliza(poliza)
                .tipoIncidente(request.getTipoIncidente())
                .descripcion(request.getDescripcion())
                .fechaOcurrencia(request.getFechaOcurrencia())
                .montoReclamado(request.getMontoReclamado())
                .estadoResolucion(Siniestro.EstadoResolucion.REGISTRADO)
                .build();
        Siniestro guardado = siniestroRepository.save(siniestro);
        auditoria.registrar("siniestro_reportado", "siniestros",
                "SIN-" + guardado.getIdSiniestro() + " reportado por " + usuario.getUsername());

        notificaciones.crearParaPortal(Usuario.PortalAcceso.TECNICO,
                Notificacion.Tipo.SINIESTRO,
                "Nuevo siniestro reportado",
                "SIN-" + guardado.getIdSiniestro() + " poliza #" + poliza.getIdPoliza()
                        + " - " + request.getTipoIncidente(),
                "/core/siniestros");

        return SiniestroResponse.from(guardado);
    }

    @Transactional
    public SiniestroResponse aceptarIndemnizacion(Usuario usuario, Integer idSiniestro) {
        Cliente cliente = clienteDelUsuario(usuario);
        Siniestro siniestro = buscar(idSiniestro);
        if (!siniestro.getPoliza().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("El siniestro no pertenece al usuario");
        }
        if (siniestro.getEstadoResolucion() != Siniestro.EstadoResolucion.PENDIENTE_ACEPTACION) {
            throw new IllegalStateException("El siniestro no esta pendiente de aceptacion");
        }

        siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.PAGO_PROGRAMADO);
        auditoria.registrar("siniestro_aceptado", "siniestros",
                "SIN-" + idSiniestro + " propuesta aceptada por el cliente");

        notificaciones.crearParaPortal(Usuario.PortalAcceso.OPERATIVO,
                Notificacion.Tipo.COBRANZA,
                "Indemnizacion aceptada",
                "El cliente acepto la propuesta para el SIN-" + idSiniestro + ". Programar pago.",
                "/finanzas/tesoreria");

        return SiniestroResponse.from(siniestroRepository.save(siniestro));
    }

    @Transactional(readOnly = true)
    public List<SiniestroAdminResponse> listarTodos(Siniestro.EstadoResolucion estado) {
        List<Siniestro> lista = (estado != null)
                ? siniestroRepository.findByEstadoResolucionOrderByFechaReporteDesc(estado)
                : siniestroRepository.findAllByOrderByFechaReporteDesc();
        return lista.stream().map(SiniestroAdminResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public SiniestroAdminResponse obtenerAdmin(Integer id) {
        return SiniestroAdminResponse.from(buscar(id));
    }

    @Transactional(readOnly = true)
    public List<DocumentoResponse> documentosDelSiniestro(Integer id) {
        buscar(id);
        return documentoService.listarPorReferencia("siniestro", id);
    }

    @Transactional
    public SiniestroAdminResponse cambiarEstado(Integer id, CambioEstadoSiniestroRequest request) {
        Siniestro siniestro = buscar(id);
        siniestro.setEstadoResolucion(request.estadoResolucion());
        auditoria.registrar("siniestro_estado", "siniestros",
                "SIN-" + id + " -> " + request.estadoResolucion().name());

        Persona persona = siniestro.getPoliza().getCliente().getPersona();
        if (persona != null && persona.getUsuario() != null) {
            notificaciones.crear(persona.getUsuario(), Notificacion.Tipo.SINIESTRO,
                    "Tu siniestro cambio de estado",
                    "SIN-" + id + " ahora esta en estado " + request.estadoResolucion().name(),
                    "/asegurado/siniestros");
        }
        return SiniestroAdminResponse.from(siniestroRepository.save(siniestro));
    }

    @Transactional
    public SiniestroAdminResponse asignarAnalista(Integer id, AsignarAnalistaRequest request) {
        Siniestro siniestro = buscar(id);
        Empleado analista = empleadoRepository.findById(request.idEmpleadoAnalista())
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado", request.idEmpleadoAnalista()));
        siniestro.setEmpleadoAnalista(analista);
        if (siniestro.getEstadoResolucion() == Siniestro.EstadoResolucion.REGISTRADO) {
            siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.EN_REVISION);
        }
        auditoria.registrar("siniestro_asignar", "siniestros",
                "SIN-" + id + " analista " + request.idEmpleadoAnalista());
        Siniestro guardado = siniestroRepository.save(siniestro);

        if (analista.getPersona() != null && analista.getPersona().getUsuario() != null) {
            notificaciones.crear(analista.getPersona().getUsuario(),
                    Notificacion.Tipo.SINIESTRO,
                    "Siniestro asignado para revision",
                    "SIN-" + id + " requiere tu atencion",
                    "/core/siniestros");
        }
        Persona personaCliente = guardado.getPoliza().getCliente().getPersona();
        if (personaCliente != null && personaCliente.getUsuario() != null) {
            notificaciones.crear(personaCliente.getUsuario(),
                    Notificacion.Tipo.SINIESTRO,
                    "Tu siniestro tiene analista asignado",
                    "SIN-" + id + " esta en revision",
                    "/asegurado/reportar");
        }

        return SiniestroAdminResponse.from(guardado);
    }

    @Transactional
    public SiniestroAdminResponse registrarObservacionPerito(Integer id, PeritoObservacionRequest request, Usuario usuario) {
        Siniestro siniestro = buscar(id);

        if (request.observacionesPerito() != null) {
            siniestro.setObservacionesPerito(request.observacionesPerito());
        }
        if (request.montoEstimadoPerito() != null) {
            siniestro.setMontoEstimadoPerito(request.montoEstimadoPerito());
        }
        if (request.informeTecnico() != null) {
            siniestro.setInformeTecnico(request.informeTecnico());
        }
        if (siniestro.getEstadoResolucion() == Siniestro.EstadoResolucion.REGISTRADO
                || siniestro.getEstadoResolucion() == Siniestro.EstadoResolucion.EN_REVISION) {
            siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.EN_EVALUACION);
        }

        auditoria.registrar("siniestro_perito", "siniestros",
                "SIN-" + id + " observacion del perito"
                        + (request.montoEstimadoPerito() != null ? " monto " + request.montoEstimadoPerito() : ""));

        return SiniestroAdminResponse.from(siniestroRepository.save(siniestro));
    }

    @Transactional(readOnly = true)
    public List<SiniestroAdminResponse> siniestrosDeAgente(Usuario usuario) {
        Empleado agente = personaRepository.findByUsuario(usuario)
                .flatMap(empleadoRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Empleado del usuario", usuario.getIdUsuario()));
        return siniestroRepository.findByAgenteComercial(agente)
                .stream().map(SiniestroAdminResponse::from).toList();
    }

    private List<EventoTimeline> construirTimeline(Siniestro siniestro) {
        String prefijo = "SIN-" + siniestro.getIdSiniestro();
        List<AuditoriaAccion> eventos = auditoriaRepository
                .findByModuloAndDetalleStartingWithOrderByFechaAsc("siniestros", prefijo);
        return eventos.stream()
                .map(a -> new EventoTimeline(
                        a.getAccion(),
                        a.getDetalle(),
                        a.getFecha(),
                        a.getUsername()
                ))
                .toList();
    }

    private Siniestro buscar(Integer id) {
        return siniestroRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", id));
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }
}
