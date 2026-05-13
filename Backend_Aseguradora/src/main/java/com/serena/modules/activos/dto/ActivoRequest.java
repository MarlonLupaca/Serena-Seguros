package com.serena.modules.activos.dto;

import com.serena.modules.activos.entity.ActivoInterno;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ActivoRequest(

        Integer idEmpleadoAsignado,

        @NotBlank @Size(max = 100) String tipo,

        @NotBlank @Size(max = 100) String marca,

        @NotNull @DecimalMin(value = "0.00") BigDecimal valorDepreciacion,

        ActivoInterno.Estado estado

) {}
