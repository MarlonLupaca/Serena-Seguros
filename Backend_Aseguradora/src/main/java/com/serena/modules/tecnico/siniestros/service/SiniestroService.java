package com.serena.modules.tecnico.siniestros.service;

import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.tecnico.siniestros.dto.AsignarAnalistaRequest;
import com.serena.modules.tecnico.siniestros.dto.CambioEstadoSiniestroRequest;
import com.serena.modules.tecnico.siniestros.dto.CrearSiniestroRequest;
import com.serena.modules.tecnico.siniestros.dto.SiniestroAdminResponse;
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
    private final NotificacionService notificaciones;

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
    public SiniestroResponse miSiniestro(Usuario usuario, Integer idSiniestro) {
        Cliente cliente = clienteDelUsuario(usuario);
        Siniestro siniestro = siniestroRepository.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        if (!siniestro.getPoliza().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("El siniestro no pertenece al usuario");
        }
        return SiniestroResponse.from(siniestro);
    }

    @Transactional
    public SiniestroResponse reportar(Usuario usuario, CrearSiniestroRequest request) {
        Cliente cliente = clienteDelUsuario(usuario);
        Poliza poliza = polizaRepository.findById(request.idPoliza())
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", request.idPoliza()));
        if (!poliza.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La poliza no pertenece al usuario");
        }
        Siniestro siniestro = Siniestro.builder()
                .poliza(poliza)
                .tipoIncidente(request.tipoIncidente())
                .descripcion(request.descripcion())
                .fechaOcurrencia(request.fechaOcurrencia())
                .montoReclamado(request.montoReclamado())
                .estadoResolucion(Siniestro.EstadoResolucion.REPORTADO)
                .build();
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
        if (siniestro.getEstadoResolucion() == Siniestro.EstadoResolucion.REPORTADO) {
            siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.EN_REVISION);
        }
        auditoria.registrar("siniestro_asignar", "siniestros",
                "SIN-" + id + " analista " + request.idEmpleadoAnalista());
        return SiniestroAdminResponse.from(siniestroRepository.save(siniestro));
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
