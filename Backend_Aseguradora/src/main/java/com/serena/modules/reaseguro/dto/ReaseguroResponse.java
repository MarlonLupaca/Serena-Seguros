package com.serena.modules.reaseguro.dto;

import com.serena.modules.reaseguro.entity.Reaseguro;

import java.math.BigDecimal;

public record ReaseguroResponse(
        Integer idReaseguro,
        Integer idPoliza,
        String polizaNombre,
        BigDecimal riesgoRetenido,
        BigDecimal riesgoCedido,
        String reaseguradoraAsociada
) {
    public static ReaseguroResponse from(Reaseguro r) {
        return new ReaseguroResponse(
                r.getIdReaseguro(),
                r.getPoliza().getIdPoliza(),
                r.getPoliza().getProducto().getNombre(),
                r.getRiesgoRetenido(),
                r.getRiesgoCedido(),
                r.getReaseguradoraAsociada()
        );
    }
}
