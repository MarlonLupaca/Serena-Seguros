package com.serena.modules.core.polizas.dto;

import com.serena.modules.core.polizas.entity.Poliza;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PolizaResponse(
        Integer idPoliza,
        Integer idCliente,
        String estadoPoliza,
        BigDecimal primaTotal,
        LocalDate vigenciaInicio,
        LocalDate vigenciaFin,
        LocalDateTime fechaEmision,
        ProductoMini producto
) {
    public static PolizaResponse from(Poliza p) {
        return new PolizaResponse(
                p.getIdPoliza(),
                p.getCliente().getIdCliente(),
                p.getEstadoPoliza().name(),
                p.getPrimaTotal(),
                p.getVigenciaInicio(),
                p.getVigenciaFin(),
                p.getFechaEmision(),
                ProductoMini.from(p.getProducto())
        );
    }
}
