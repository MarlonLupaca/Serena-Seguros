package com.serena.modules.seguridad.perfil.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record BeneficiarioRequest(
        @NotBlank @Size(max = 100) String nombres,
        @NotBlank @Size(max = 100) String apellidos,
        @NotBlank @Size(max = 50) String parentesco,
        @Size(max = 20) String documentoIdentidad,
        @NotNull @DecimalMin("0.01") @DecimalMax("100.00") BigDecimal porcentaje
) {}
