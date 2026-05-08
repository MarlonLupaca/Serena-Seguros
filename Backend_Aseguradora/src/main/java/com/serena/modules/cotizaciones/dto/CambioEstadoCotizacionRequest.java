package com.serena.modules.cotizaciones.dto;

import com.serena.modules.cotizaciones.entity.LeadCotizacion;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoCotizacionRequest(

        @NotNull(message = "El estado es obligatorio")
        LeadCotizacion.EstadoKanban estadoKanban

) {}
