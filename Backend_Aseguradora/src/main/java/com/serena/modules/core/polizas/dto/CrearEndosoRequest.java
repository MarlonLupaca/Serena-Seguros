package com.serena.modules.core.polizas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearEndosoRequest(

        @NotBlank(message = "El tipo de cambio es obligatorio")
        @Size(max = 100)
        String tipoCambio,

        @NotBlank(message = "La descripcion es obligatoria")
        String descripcionCambio

) {}
