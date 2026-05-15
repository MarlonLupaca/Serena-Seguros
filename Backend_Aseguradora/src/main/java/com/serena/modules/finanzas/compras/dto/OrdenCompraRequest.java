package com.serena.modules.finanzas.compras.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OrdenCompraRequest(
        @NotNull Integer idSolicitud,
        @NotNull Integer idProveedorInterno,
        @NotNull @DecimalMin("0.00") BigDecimal montoTotal
) {}
