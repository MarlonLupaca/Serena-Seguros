package com.serena.modules.comercial.cotizaciones.dto;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record GuardarCotizacionRequest(

        @NotNull LeadCotizacion.ProductoInteres productoInteres,

        Integer idProducto,

        @NotNull
        @DecimalMin(value = "0.00")
        BigDecimal primaEstimada,

        String nivelPlan

) {}
