package com.serena.modules.comercial.cotizaciones.dto;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MiCotizacionResponse(
        Integer idCotizacion,
        String productoInteres,
        String estadoKanban,
        BigDecimal primaEstimada,
        LocalDateTime fechaIngreso,
        String tipoOrigen,
        String estadoEvaluacion,
        String motivoRechazo,
        BigDecimal factorRiesgo
) {
    public static MiCotizacionResponse from(LeadCotizacion l, EvaluacionRiesgo eval) {
        return new MiCotizacionResponse(
                l.getIdCotizacion(),
                l.getProductoInteres().name(),
                l.getEstadoKanban().name(),
                l.getPrimaEstimada(),
                l.getFechaIngreso(),
                l.getTipoOrigen().name(),
                eval != null ? eval.getEstadoSuscripcion().name() : null,
                eval != null ? eval.getMotivoRechazo() : null,
                eval != null ? eval.getFactorRiesgo() : null
        );
    }
}
