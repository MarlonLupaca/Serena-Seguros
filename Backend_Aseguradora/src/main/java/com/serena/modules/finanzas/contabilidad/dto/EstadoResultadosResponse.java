package com.serena.modules.finanzas.contabilidad.dto;

import java.math.BigDecimal;
import java.util.List;

public record EstadoResultadosResponse(
        List<BalanceResponse.LineaCuenta> ingresos,
        List<BalanceResponse.LineaCuenta> gastos,
        BigDecimal totalIngresos,
        BigDecimal totalGastos,
        BigDecimal utilidadNeta
) {}
