package com.serena.modules.siniestros.dto;

import com.serena.modules.siniestros.entity.Siniestro;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SiniestroResponse(
        Integer idSiniestro,
        Integer idPoliza,
        String polizaNombre,
        String polizaTipo,
        String tipoIncidente,
        String descripcion,
        LocalDate fechaOcurrencia,
        LocalDateTime fechaReporte,
        String estadoResolucion,
        BigDecimal montoReclamado
) {
    public static SiniestroResponse from(Siniestro s) {
        return new SiniestroResponse(
                s.getIdSiniestro(),
                s.getPoliza().getIdPoliza(),
                s.getPoliza().getProducto().getNombre(),
                s.getPoliza().getProducto().getTipoSeguro().name(),
                s.getTipoIncidente(),
                s.getDescripcion(),
                s.getFechaOcurrencia(),
                s.getFechaReporte(),
                s.getEstadoResolucion().name(),
                s.getMontoReclamado()
        );
    }
}
