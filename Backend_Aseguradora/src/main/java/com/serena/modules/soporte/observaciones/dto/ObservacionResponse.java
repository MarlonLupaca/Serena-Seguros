package com.serena.modules.soporte.observaciones.dto;

import com.serena.modules.soporte.observaciones.entity.Observacion;
import java.time.LocalDateTime;

public record ObservacionResponse(
    Integer idObservacion,
    String tipoReferencia,
    Integer idReferencia,
    String autorRol,
    String autorNombre,
    String comentario,
    LocalDateTime fechaCreacion
) {
    public static ObservacionResponse from(Observacion obs) {
        String nombre = obs.getAutor() != null ? obs.getAutor().getUsername() : "Sistema";
        return new ObservacionResponse(
            obs.getIdObservacion(),
            obs.getTipoReferencia(),
            obs.getIdReferencia(),
            obs.getAutorRol(),
            nombre,
            obs.getComentario(),
            obs.getFechaCreacion()
        );
    }
}
