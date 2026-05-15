package com.serena.modules.finanzas.nomina.dto;

import com.serena.modules.finanzas.nomina.entity.PlanillaMensual;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PlanillaResponse(
        Integer idPlanilla,
        String periodo,
        BigDecimal totalPlanilla,
        BigDecimal totalDescuentos,
        BigDecimal totalNeto,
        String estado,
        LocalDateTime fechaProceso
) {
    public static PlanillaResponse from(PlanillaMensual p) {
        return new PlanillaResponse(
                p.getIdPlanilla(),
                p.getPeriodo(),
                p.getTotalPlanilla(),
                p.getTotalDescuentos(),
                p.getTotalNeto(),
                p.getEstado().name(),
                p.getFechaProceso()
        );
    }
}
