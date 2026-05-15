package com.serena.modules.seguridad.clientes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearNotaRequest(
        @NotBlank @Size(max = 2000) String texto
) {}
