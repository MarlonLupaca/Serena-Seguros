package com.serena.modules.productos.dto;

import com.serena.modules.productos.entity.ProductoSeguro;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductoRequest(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String nombre,

        @NotNull(message = "El tipo de seguro es obligatorio")
        ProductoSeguro.TipoSeguro tipoSeguro,

        @NotNull(message = "La prima base es obligatoria")
        @DecimalMin(value = "0.00", message = "La prima base no puede ser negativa")
        BigDecimal primaBase,

        String limitesCobertura,

        @Min(value = 0, message = "Edad minima 0")
        @Max(value = 120, message = "Edad maxima 120")
        Integer restriccionesEdad,

        @DecimalMin(value = "0.00", message = "La tasa no puede ser negativa")
        BigDecimal tasas

) {}
