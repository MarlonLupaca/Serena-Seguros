package com.serena.modules.soporte.observaciones.dto;

import jakarta.validation.constraints.NotBlank;

public record ObservacionRequest(
    @NotBlank(message = "El comentario es obligatorio")
    String comentario
) {}
