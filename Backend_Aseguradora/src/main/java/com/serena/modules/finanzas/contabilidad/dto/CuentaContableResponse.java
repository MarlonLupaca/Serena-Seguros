package com.serena.modules.finanzas.contabilidad.dto;

import com.serena.modules.finanzas.contabilidad.entity.CuentaContable;

public record CuentaContableResponse(
        Integer idCuenta,
        String codigo,
        String nombre,
        String tipo
) {
    public static CuentaContableResponse from(CuentaContable c) {
        return new CuentaContableResponse(c.getIdCuenta(), c.getCodigo(), c.getNombre(), c.getTipo().name());
    }
}
