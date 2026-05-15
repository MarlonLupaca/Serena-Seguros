package com.serena.modules.finanzas.compras.dto;

import com.serena.modules.finanzas.compras.entity.SolicitudCompra;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoSolicitudRequest(
        @NotNull SolicitudCompra.Estado estado
) {}
