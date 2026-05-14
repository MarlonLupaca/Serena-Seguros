package com.serena.modules.core.reaseguro.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ReaseguroRequest(

        @NotNull(message = "La poliza es obligatoria")
        Integer idPoliza,

        @NotNull
        @DecimalMin(value = "0.00")
        BigDecimal riesgoRetenido,

        @NotNull
        @DecimalMin(value = "0.00")
        BigDecimal riesgoCedido,

        @NotBlank(message = "La reaseguradora es obligatoria")
        @Size(max = 150)
        String reaseguradoraAsociada

) {}
