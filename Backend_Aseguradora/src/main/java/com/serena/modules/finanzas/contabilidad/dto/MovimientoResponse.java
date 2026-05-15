package com.serena.modules.finanzas.contabilidad.dto;

import com.serena.modules.finanzas.contabilidad.entity.MovimientoContable;

import java.math.BigDecimal;

public record MovimientoResponse(
        Integer idMovimiento,
        Integer idCuenta,
        String cuentaCodigo,
        String cuentaNombre,
        BigDecimal debe,
        BigDecimal haber
) {
    public static MovimientoResponse from(MovimientoContable m) {
        return new MovimientoResponse(
                m.getIdMovimiento(),
                m.getCuenta().getIdCuenta(),
                m.getCuenta().getCodigo(),
                m.getCuenta().getNombre(),
                m.getDebe(),
                m.getHaber()
        );
    }
}
