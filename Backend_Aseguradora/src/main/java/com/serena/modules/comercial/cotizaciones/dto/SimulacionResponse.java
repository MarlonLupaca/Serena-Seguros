package com.serena.modules.comercial.cotizaciones.dto;

import java.math.BigDecimal;
import java.util.List;

public record SimulacionResponse(
        String productoInteres,
        Integer edad,
        BigDecimal montoAsegurado,
        String ubicacion,
        List<PlanSimulado> planes
) {
    public record PlanSimulado(
            String nivel,
            String nombre,
            BigDecimal primaMensual,
            BigDecimal primaAnual,
            BigDecimal cobertura,
            BigDecimal deducible,
            List<String> beneficios
    ) {}
}
