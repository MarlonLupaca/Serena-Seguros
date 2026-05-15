package com.serena.modules.finanzas.contabilidad.dto;

import java.math.BigDecimal;
import java.util.List;

public record BalanceResponse(
        List<LineaCuenta> activos,
        List<LineaCuenta> pasivos,
        List<LineaCuenta> patrimonio,
        BigDecimal totalActivos,
        BigDecimal totalPasivos,
        BigDecimal totalPatrimonio
) {
    public record LineaCuenta(String codigo, String nombre, BigDecimal saldo) {}
}
