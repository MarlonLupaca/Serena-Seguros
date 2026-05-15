package com.serena.modules.tecnico.validaciones.service;

import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.modules.tecnico.validaciones.dto.RechazoRequest;
import com.serena.modules.tecnico.validaciones.dto.ValidacionResponse;
import com.serena.modules.tecnico.validaciones.entity.ValidacionDocumental;
import com.serena.modules.tecnico.validaciones.repository.ValidacionRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidacionService {

    private final ValidacionRepository validacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;
    private final AuditoriaService auditoria;
    private final NotificacionService notificaciones;

    @Transactional(readOnly = true)
    public List<ValidacionResponse> listar(ValidacionDocumental.Estado estado) {
        List<ValidacionDocumental> lista = (estado != null)
                ? validacionRepository.findByEstadoOrderByFechaIngresoDesc(estado)
                : validacionRepository.findAllByOrderByFechaIngresoDesc();
        return lista.stream().map(ValidacionResponse::from).toList();
    }

    @Transactional
    public ValidacionResponse aprobar(Integer id, Usuario usuario) {
        ValidacionDocumental v = buscar(id);
        v.setEstado(ValidacionDocumental.Estado.APROBADO);
        v.setMotivoRechazo(null);
        v.setEmpleadoValidador(empleadoDelUsuario(usuario));
        v.setFechaResolucion(LocalDateTime.now());

        auditoria.registrar("validacion_aprobada", "validaciones",
                "VAL-" + id + " aprobada para CLI-" + v.getCliente().getIdCliente());

        notificar(v, "Tu identidad fue verificada",
                "La validacion de tus documentos fue aprobada. Ya puedes contratar productos.");

        return ValidacionResponse.from(validacionRepository.save(v));
    }

    @Transactional
    public ValidacionResponse rechazar(Integer id, RechazoRequest request, Usuario usuario) {
        ValidacionDocumental v = buscar(id);
        v.setEstado(ValidacionDocumental.Estado.RECHAZADO);
        v.setMotivoRechazo(request.motivo());
        v.setEmpleadoValidador(empleadoDelUsuario(usuario));
        v.setFechaResolucion(LocalDateTime.now());

        auditoria.registrar("validacion_rechazada", "validaciones",
                "VAL-" + id + " rechazada: " + request.motivo());

        notificar(v, "Tu validacion fue rechazada",
                "Motivo: " + request.motivo() + ". Puedes volver a enviar tus documentos.");

        return ValidacionResponse.from(validacionRepository.save(v));
    }

    @Transactional
    public ValidacionResponse solicitarCorreccion(Integer id, RechazoRequest request, Usuario usuario) {
        ValidacionDocumental v = buscar(id);
        v.setEstado(ValidacionDocumental.Estado.CORRECCION);
        v.setMotivoRechazo(request.motivo());
        v.setEmpleadoValidador(empleadoDelUsuario(usuario));
        v.setFechaResolucion(null);

        auditoria.registrar("validacion_correccion", "validaciones",
                "VAL-" + id + " solicita correccion: " + request.motivo());

        notificar(v, "Necesitamos que corrijas tus documentos",
                request.motivo());

        return ValidacionResponse.from(validacionRepository.save(v));
    }

    private ValidacionDocumental buscar(Integer id) {
        return validacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Validacion", id));
    }

    private Empleado empleadoDelUsuario(Usuario usuario) {
        if (usuario == null) return null;
        return personaRepository.findByUsuario(usuario)
                .flatMap(empleadoRepository::findByPersona)
                .orElse(null);
    }

    private void notificar(ValidacionDocumental v, String titulo, String mensaje) {
        Persona persona = v.getCliente().getPersona();
        if (persona != null && persona.getUsuario() != null) {
            notificaciones.crear(persona.getUsuario(), Notificacion.Tipo.GENERAL,
                    titulo, mensaje, "/asegurado/perfil");
        }
    }
}
