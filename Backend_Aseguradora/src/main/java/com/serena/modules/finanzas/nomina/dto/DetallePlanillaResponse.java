package com.serena.modules.finanzas.nomina.dto;

import com.serena.modules.finanzas.nomina.entity.DetallePlanilla;

import java.math.BigDecimal;

public record DetallePlanillaResponse(
        Integer idDetalle,
        Integer idEmpleado,
        String empleadoNombre,
        String area,
        String cargo,
        BigDecimal sueldoBase,
        BigDecimal bonos,
        BigDecimal horasExtra,
        BigDecimal afpOnp,
        BigDecimal impuestoRenta,
        BigDecimal neto
) {
    public static DetallePlanillaResponse from(DetallePlanilla d) {
        var emp = d.getEmpleado();
        var per = emp.getPersona();
        return new DetallePlanillaResponse(
                d.getIdDetalle(),
                emp.getIdEmpleado(),
                per.getNombres() + " " + per.getApellidos(),
                emp.getArea(),
                emp.getCargo(),
                d.getSueldoBase(),
                d.getBonos(),
                d.getHorasExtra(),
                d.getAfpOnp(),
                d.getImpuestoRenta(),
                d.getNeto()
        );
    }
}
