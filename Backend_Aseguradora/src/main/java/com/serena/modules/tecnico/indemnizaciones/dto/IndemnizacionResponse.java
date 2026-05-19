package com.serena.modules.tecnico.indemnizaciones.dto;

import com.serena.modules.tecnico.indemnizaciones.entity.Indemnizacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record IndemnizacionResponse(
        Integer idIndemnizacion,
        Integer idSiniestro,
        Integer idPolizaBeneficiario,
        String beneficiarioNombre,
        BigDecimal montoAprobado,
        BigDecimal montoPagado,
        String medioPago,
        LocalDateTime fechaAprobacion,
        LocalDateTime fechaPago,
        String observaciones
) {
    public static IndemnizacionResponse from(Indemnizacion i) {
        var pb = i.getPolizaBeneficiario();
        String nombre = pb != null ? pb.getNombres() + " " + pb.getApellidos() : null;
        return new IndemnizacionResponse(
                i.getIdIndemnizacion(),
                i.getSiniestro().getIdSiniestro(),
                pb != null ? pb.getIdPolizaBeneficiario() : null,
                nombre,
                i.getMontoAprobado(),
                i.getMontoPagado(),
                i.getMedioPago().name(),
                i.getFechaAprobacion(),
                i.getFechaPago(),
                i.getObservaciones()
        );
    }
}
