package com.serena.modules.core.polizas.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmitirPolizaRequest(

        @NotNull(message = "El cliente es obligatorio")
        Integer idCliente,

        @NotNull(message = "El producto es obligatorio")
        Integer idProducto,

        @NotNull(message = "La prima total es obligatoria")
        @DecimalMin(value = "0.00")
        BigDecimal primaTotal,

        @NotNull(message = "La fecha de inicio es obligatoria")
        LocalDate vigenciaInicio,

        @NotNull(message = "La fecha de fin es obligatoria")
        LocalDate vigenciaFin

) {}
