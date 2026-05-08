package com.serena.modules.polizas.dto;

import com.serena.modules.polizas.entity.EndosoPoliza;

import java.time.LocalDateTime;

public record EndosoAdminResponse(
        Integer idEndoso,
        Integer idPoliza,
        String polizaNombre,
        String polizaTipo,
        String tipoCambio,
        String descripcionCambio,
        String estadoAprobacion,
        LocalDateTime fechaSolicitud
) {
    public static EndosoAdminResponse from(EndosoPoliza e) {
        var poliza = e.getPoliza();
        return new EndosoAdminResponse(
                e.getIdEndoso(),
                poliza.getIdPoliza(),
                poliza.getProducto().getNombre(),
                poliza.getProducto().getTipoSeguro().name(),
                e.getTipoCambio(),
                e.getDescripcionCambio(),
                e.getEstadoAprobacion().name(),
                e.getFechaSolicitud()
        );
    }
}
