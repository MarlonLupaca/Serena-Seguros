package com.serena.modules.tecnico.siniestros.dto;

import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoSiniestroRequest(

        @NotNull(message = "El estado es obligatorio")
        Siniestro.EstadoResolucion estadoResolucion

) {}
