package com.serena.modules.seguridad.empleados.dto;

import com.serena.modules.seguridad.empleados.entity.Empleado;

import java.math.BigDecimal;

public record EmpleadoResponse(
        Integer idEmpleado,
        Integer idPersona,
        String nombres,
        String apellidos,
        String documentoIdentidad,
        String email,
        String telefono,
        String cargo,
        String area,
        BigDecimal sueldoBase
) {
    public static EmpleadoResponse from(Empleado e) {
        var p = e.getPersona();
        return new EmpleadoResponse(
                e.getIdEmpleado(),
                p.getIdPersona(),
                p.getNombres(),
                p.getApellidos(),
                p.getDocumentoIdentidad(),
                p.getEmail(),
                p.getTelefono(),
                e.getCargo(),
                e.getArea(),
                e.getSueldoBase()
        );
    }
}
