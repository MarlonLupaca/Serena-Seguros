package com.serena.modules.polizas.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PolizaDetalleResponse(
        Integer idPoliza,
        String estadoPoliza,
        BigDecimal primaTotal,
        LocalDate vigenciaInicio,
        LocalDate vigenciaFin,
        LocalDateTime fechaEmision,
        ProductoMini producto,
        List<EndosoResponse> endosos
) {}
