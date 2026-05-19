package com.serena.modules.core.polizas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;

public record DesignarBeneficiariosRequest(
        @NotEmpty @Valid List<Beneficiario> beneficiarios
) {
    public record Beneficiario(
            Integer idBeneficiario,
            @NotBlank String nombres,
            @NotBlank String apellidos,
            @NotBlank String parentesco,
            String documentoIdentidad,
            @NotNull @PositiveOrZero BigDecimal porcentaje
    ) {}
}
