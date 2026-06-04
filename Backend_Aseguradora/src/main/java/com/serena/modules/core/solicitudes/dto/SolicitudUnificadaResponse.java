package com.serena.modules.core.solicitudes.dto;

import java.time.LocalDateTime;

public record SolicitudUnificadaResponse(
        String idReferencia,
        String tipoSolicitud,
        LocalDateTime fecha,
        String descripcion,
        String estado
) {
}
