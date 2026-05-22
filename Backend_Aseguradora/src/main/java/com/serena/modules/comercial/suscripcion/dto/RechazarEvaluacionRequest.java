package com.serena.modules.comercial.suscripcion.dto;

import jakarta.validation.constraints.NotBlank;

public record RechazarEvaluacionRequest(
        @NotBlank String motivoRechazo
) {}
