package com.serena.modules.ejecutivo.riesgos.dto;

import com.serena.modules.ejecutivo.riesgos.entity.RiesgoCorporativo;

import java.time.LocalDateTime;

public record RiesgoResponse(
        Integer idRiesgo,
        String tipo,
        String descripcion,
        String severidad,
        String areaAfectada,
        LocalDateTime fechaRegistro,
        String registradoPor
) {
    public static RiesgoResponse from(RiesgoCorporativo r) {
        return new RiesgoResponse(
                r.getIdRiesgo(),
                r.getTipo().name(),
                r.getDescripcion(),
                r.getSeveridad().name(),
                r.getAreaAfectada(),
                r.getFechaRegistro(),
                r.getRegistradoPor() != null ? r.getRegistradoPor().getUsername() : null
        );
    }
}
