package com.serena.modules.comercial.cotizaciones.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratacionResponse(
        Integer idCotizacion,
        Integer idPoliza,
        String estadoPoliza,
        BigDecimal primaTotal,
        LocalDate vigenciaInicio,
        LocalDate vigenciaFin
) {}
