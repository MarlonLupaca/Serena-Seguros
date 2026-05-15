package com.serena.modules.ejecutivo.riesgos.dto;

import com.serena.modules.ejecutivo.riesgos.entity.RiesgoCorporativo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RiesgoRequest(
        @NotNull RiesgoCorporativo.Tipo tipo,
        @NotBlank @Size(max = 2000) String descripcion,
        @NotNull RiesgoCorporativo.Severidad severidad,
        @Size(max = 100) String areaAfectada
) {}
