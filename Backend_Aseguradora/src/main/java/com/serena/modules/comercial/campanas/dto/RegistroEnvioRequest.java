package com.serena.modules.comercial.campanas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RegistroEnvioRequest(

        @NotNull(message = "Cantidad de enviados es obligatoria")
        @Min(value = 0, message = "La cantidad no puede ser negativa")
        Integer enviados,

        @Min(value = 0, message = "La cantidad no puede ser negativa")
        Integer abiertos

) {}
