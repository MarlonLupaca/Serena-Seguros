package com.serena.modules.comercial.cotizaciones.dto;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CotizacionResponse(
        Integer idCotizacion,
        Integer idEmpleadoAgente,
        String productoInteres,
        String estadoKanban,
        BigDecimal primaEstimada,
        LocalDateTime fechaIngreso,
        String agenteAsignado
) {
    public static CotizacionResponse from(LeadCotizacion l) {
        var persona = l.getEmpleadoAgente().getPersona();
        return new CotizacionResponse(
                l.getIdCotizacion(),
                l.getEmpleadoAgente().getIdEmpleado(),
                l.getProductoInteres().name(),
                l.getEstadoKanban().name(),
                l.getPrimaEstimada(),
                l.getFechaIngreso(),
                persona.getNombres() + " " + persona.getApellidos()
        );
    }
}
