package com.serena.modules.siniestros.dto;

import com.serena.modules.siniestros.entity.Siniestro;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoSiniestroRequest(

        @NotNull(message = "El estado es obligatorio")
        Siniestro.EstadoResolucion estadoResolucion

) {}
