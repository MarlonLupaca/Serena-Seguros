package com.serena.modules.finanzas.nomina.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ProcesarPlanillaRequest(

        @NotBlank
        @Pattern(regexp = "\\d{4}-\\d{2}", message = "El periodo debe tener formato YYYY-MM")
        String periodo

) {}
