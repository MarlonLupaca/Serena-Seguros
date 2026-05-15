package com.serena.modules.tecnico.siniestros.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record SiniestroDetalleResponse(
        Integer idSiniestro,
        Integer idPoliza,
        String polizaNombre,
        String polizaTipo,
        String tipoIncidente,
        String descripcion,
        LocalDate fechaOcurrencia,
        LocalDateTime fechaReporte,
        String estadoResolucion,
        BigDecimal montoReclamado,
        List<EventoTimeline> timeline
) {
    public record EventoTimeline(
            String accion,
            String detalle,
            LocalDateTime fecha,
            String autor
    ) {}
}
