package com.serena.modules.activos.dto;

import com.serena.modules.activos.entity.ActivoInterno;

import java.math.BigDecimal;

public record ActivoResponse(
        Integer idActivo,
        Integer idEmpleadoAsignado,
        String empleadoAsignado,
        String tipo,
        String marca,
        BigDecimal valorDepreciacion,
        String estado
) {
    public static ActivoResponse from(ActivoInterno a) {
        var emp = a.getEmpleadoAsignado();
        return new ActivoResponse(
                a.getIdActivo(),
                emp != null ? emp.getIdEmpleado() : null,
                emp != null ? emp.getPersona().getNombres() + " " + emp.getPersona().getApellidos() : null,
                a.getTipo(),
                a.getMarca(),
                a.getValorDepreciacion(),
                a.getEstado().name()
        );
    }
}
