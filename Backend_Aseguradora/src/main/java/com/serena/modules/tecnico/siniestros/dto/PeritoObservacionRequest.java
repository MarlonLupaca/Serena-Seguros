package com.serena.modules.tecnico.siniestros.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PeritoObservacionRequest(

        @Size(max = 4000)
        String observacionesPerito,

        @DecimalMin(value = "0.00", message = "El monto estimado no puede ser negativo")
        BigDecimal montoEstimadoPerito,

        @Size(max = 500)
        String informeTecnico

) {}
