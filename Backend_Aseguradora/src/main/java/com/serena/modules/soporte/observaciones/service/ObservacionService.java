package com.serena.modules.soporte.observaciones.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.modules.soporte.observaciones.dto.ObservacionRequest;
import com.serena.modules.soporte.observaciones.dto.ObservacionResponse;
import com.serena.modules.soporte.observaciones.entity.Observacion;
import com.serena.modules.soporte.observaciones.repository.ObservacionRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ObservacionService {

    private final ObservacionRepository observacionRepository;
    private final SiniestroRepository siniestroRepository;
    private final AuditoriaService auditoria;
    private final NotificacionService notificaciones;

    @Transactional(readOnly = true)
    public List<ObservacionResponse> listar(String tipoReferencia, Integer idReferencia) {
        return observacionRepository.findByTipoReferenciaAndIdReferenciaOrderByFechaCreacionAsc(tipoReferencia, idReferencia)
                .stream()
                .map(ObservacionResponse::from)
                .toList();
    }

    @Transactional
    public ObservacionResponse agregar(String tipoReferencia, Integer idReferencia, Usuario autor, String rol, ObservacionRequest request) {
        Observacion obs = Observacion.builder()
                .tipoReferencia(tipoReferencia)
                .idReferencia(idReferencia)
                .autor(autor)
                .autorRol(rol)
                .comentario(request.comentario())
                .build();
        
        Observacion guardada = observacionRepository.save(obs);

        // Automatización de estados para Siniestros
        if ("SINIESTRO".equalsIgnoreCase(tipoReferencia)) {
            siniestroRepository.findById(idReferencia).ifPresent(siniestro -> {
                if ("TECNICO".equalsIgnoreCase(rol)) {
                    siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.DOCUMENTACION_PENDIENTE);
                    
                    // Notificar al asegurado
                    if (siniestro.getPoliza().getCliente().getPersona() != null && siniestro.getPoliza().getCliente().getPersona().getUsuario() != null) {
                        notificaciones.crear(siniestro.getPoliza().getCliente().getPersona().getUsuario(),
                                Notificacion.Tipo.SINIESTRO,
                                "Observación en tu Siniestro",
                                "SIN-" + idReferencia + " requiere información adicional.",
                                "/asegurado/solicitudes");
                    }
                } else if ("CLIENTE".equalsIgnoreCase(rol)) {
                    siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.EN_REVISION);
                    
                    // Notificar al analista asignado (si existe)
                    if (siniestro.getEmpleadoAnalista() != null && siniestro.getEmpleadoAnalista().getPersona() != null && siniestro.getEmpleadoAnalista().getPersona().getUsuario() != null) {
                        notificaciones.crear(siniestro.getEmpleadoAnalista().getPersona().getUsuario(),
                                Notificacion.Tipo.SINIESTRO,
                                "El cliente respondió a la observación",
                                "SIN-" + idReferencia + " fue actualizado.",
                                "/core/siniestros");
                    }
                }
                siniestroRepository.save(siniestro);
                auditoria.registrar("observacion_siniestro", "siniestros", "SIN-" + idReferencia + " nuevo comentario de " + rol);
            });
        }

        return ObservacionResponse.from(guardada);
    }
}
