package com.serena.modules.comercial.suscripcion.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Map;

public record EvaluacionRiesgoRequest(
        @NotNull Map<String, Object> datosRiesgo,
        BigDecimal sumaAsegurada
) {}
