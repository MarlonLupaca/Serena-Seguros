package com.serena.modules.core.polizas.dto;

import com.serena.modules.core.polizas.entity.EndosoPoliza;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoEndosoRequest(

        @NotNull(message = "El estado es obligatorio")
        EndosoPoliza.EstadoAprobacion estadoAprobacion

) {}
