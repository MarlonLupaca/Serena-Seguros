package com.serena.modules.comercial.propuestas.dto;

import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record GenerarPropuestaRequest(
        @NotNull @Positive BigDecimal sumaAsegurada,
        BigDecimal deducible,
        PropuestaPoliza.FrecuenciaPago frecuenciaPago,
        Integer numeroCuotas,
        Integer vigenciaMeses
) {}
