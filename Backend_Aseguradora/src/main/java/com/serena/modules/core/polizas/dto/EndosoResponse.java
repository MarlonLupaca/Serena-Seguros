package com.serena.modules.core.polizas.dto;

import com.serena.modules.core.polizas.entity.EndosoPoliza;

import java.time.LocalDateTime;

public record EndosoResponse(
        Integer idEndoso,
        String tipoCambio,
        String descripcionCambio,
        String estadoAprobacion,
        LocalDateTime fechaSolicitud
) {
    public static EndosoResponse from(EndosoPoliza e) {
        return new EndosoResponse(
                e.getIdEndoso(),
                e.getTipoCambio(),
                e.getDescripcionCambio(),
                e.getEstadoAprobacion().name(),
                e.getFechaSolicitud()
        );
    }
}
