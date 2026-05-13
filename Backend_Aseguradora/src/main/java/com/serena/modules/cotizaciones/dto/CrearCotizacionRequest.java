package com.serena.modules.cotizaciones.dto;

import com.serena.modules.cotizaciones.entity.LeadCotizacion;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CrearCotizacionRequest(

        @NotNull(message = "El producto de interes es obligatorio")
        LeadCotizacion.ProductoInteres productoInteres,

        Integer idProducto,

        @DecimalMin(value = "0.00", message = "La prima estimada no puede ser negativa")
        BigDecimal primaEstimada

) {}
