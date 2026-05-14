package com.serena.modules.comercial.comisiones.dto;

import com.serena.modules.comercial.comisiones.entity.ComisionAgente;

import java.math.BigDecimal;

public record ComisionResponse(
        Integer idComision,
        Integer idEmpleadoAgente,
        String agente,
        Integer idPoliza,
        String polizaNombre,
        String polizaTipo,
        BigDecimal porcentaje,
        BigDecimal montoGenerado,
        String estadoPago
) {
    public static ComisionResponse from(ComisionAgente c) {
        var persona = c.getEmpleadoAgente().getPersona();
        return new ComisionResponse(
                c.getIdComision(),
                c.getEmpleadoAgente().getIdEmpleado(),
                persona.getNombres() + " " + persona.getApellidos(),
                c.getPoliza().getIdPoliza(),
                c.getPoliza().getProducto().getNombre(),
                c.getPoliza().getProducto().getTipoSeguro().name(),
                c.getPorcentaje(),
                c.getMontoGenerado(),
                c.getEstadoPago().name()
        );
    }
}
