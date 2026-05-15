package com.serena.modules.comercial.cotizaciones.dto;

import jakarta.validation.constraints.NotNull;

public record ContratarCotizacionRequest(

        @NotNull Integer idProducto,

        Boolean aceptaTerminos

) {}
