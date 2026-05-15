package com.serena.modules.finanzas.compras.dto;

import com.serena.modules.finanzas.compras.entity.SolicitudCompra;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SolicitudCompraRequest(
        @NotBlank @Size(max = 100) String area,
        @NotBlank @Size(max = 200) String producto,
        @Size(max = 2000) String descripcion,
        @NotNull @DecimalMin("0.00") BigDecimal montoEstimado,
        SolicitudCompra.Prioridad prioridad
) {}
