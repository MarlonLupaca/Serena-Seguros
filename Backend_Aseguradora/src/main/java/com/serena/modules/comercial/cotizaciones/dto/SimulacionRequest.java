package com.serena.modules.comercial.cotizaciones.dto;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SimulacionRequest(

        @NotNull(message = "El producto de interes es obligatorio")
        LeadCotizacion.ProductoInteres productoInteres,

        @Min(value = 0, message = "La edad no puede ser negativa")
        Integer edad,

        @DecimalMin(value = "0.00", message = "El monto asegurado no puede ser negativo")
        BigDecimal montoAsegurado,

        String ubicacion

) {}
