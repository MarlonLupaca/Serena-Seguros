package com.serena.modules.comercial.suscripcion.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public record EvaluacionRiesgoResponse(
        Integer idEvaluacion,
        Integer idCotizacion,
        String tipoSeguro,
        Map<String, Object> datosRiesgo,
        BigDecimal factorRiesgo,
        String estadoSuscripcion,
        String motivoRechazo,
        LocalDateTime fechaEvaluacion
) {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static EvaluacionRiesgoResponse from(EvaluacionRiesgo e) {
        Map<String, Object> datos;
        try {
            datos = MAPPER.readValue(e.getDatosRiesgo(), Map.class);
        } catch (Exception ex) {
            datos = Map.of();
        }
        return new EvaluacionRiesgoResponse(
                e.getIdEvaluacion(),
                e.getCotizacion().getIdCotizacion(),
                e.getTipoSeguro().name(),
                datos,
                e.getFactorRiesgo(),
                e.getEstadoSuscripcion().name(),
                e.getMotivoRechazo(),
                e.getFechaEvaluacion()
        );
    }
}
