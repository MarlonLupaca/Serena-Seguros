package com.serena.modules.proveedores.dto;

import com.serena.modules.proveedores.entity.ProveedorRed;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProveedorRequest(

        @NotNull(message = "El rubro es obligatorio")
        ProveedorRed.Rubro rubro,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 150)
        String nombre,

        @NotBlank(message = "La ciudad es obligatoria")
        @Size(max = 100)
        String ciudad,

        @DecimalMin(value = "0.00", message = "El rating no puede ser negativo")
        @DecimalMax(value = "5.00", message = "El rating maximo es 5.00")
        BigDecimal ratingInterno

) {}
