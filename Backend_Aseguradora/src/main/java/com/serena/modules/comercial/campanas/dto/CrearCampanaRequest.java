package com.serena.modules.comercial.campanas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearCampanaRequest(

        @NotBlank(message = "El asunto es obligatorio")
        @Size(max = 200)
        String asunto,

        @NotBlank(message = "La plantilla es obligatoria")
        String plantilla

) {}
