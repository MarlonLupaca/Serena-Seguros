package com.serena.modules.comercial.cotizaciones.dto;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoCotizacionRequest(

        @NotNull(message = "El estado es obligatorio")
        LeadCotizacion.EstadoKanban estadoKanban

) {}
