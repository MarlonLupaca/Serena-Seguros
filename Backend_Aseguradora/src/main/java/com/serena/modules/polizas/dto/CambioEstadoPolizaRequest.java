package com.serena.modules.polizas.dto;

import com.serena.modules.polizas.entity.Poliza;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoPolizaRequest(

        @NotNull(message = "El estado es obligatorio")
        Poliza.EstadoPoliza estadoPoliza

) {}
