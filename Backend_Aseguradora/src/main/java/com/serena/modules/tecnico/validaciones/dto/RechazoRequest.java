package com.serena.modules.tecnico.validaciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RechazoRequest(
        @NotBlank @Size(max = 500) String motivo
) {}
