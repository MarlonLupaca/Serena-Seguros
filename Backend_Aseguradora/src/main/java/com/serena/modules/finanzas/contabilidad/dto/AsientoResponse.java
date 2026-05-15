package com.serena.modules.finanzas.contabilidad.dto;

import com.serena.modules.finanzas.contabilidad.entity.AsientoContable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AsientoResponse(
        Integer idAsiento,
        LocalDate fecha,
        String descripcion,
        BigDecimal totalDebe,
        BigDecimal totalHaber,
        String estado,
        List<MovimientoResponse> movimientos
) {
    public static AsientoResponse from(AsientoContable a, List<MovimientoResponse> movs) {
        return new AsientoResponse(
                a.getIdAsiento(),
                a.getFecha(),
                a.getDescripcion(),
                a.getTotalDebe(),
                a.getTotalHaber(),
                a.getEstado().name(),
                movs
        );
    }
}
