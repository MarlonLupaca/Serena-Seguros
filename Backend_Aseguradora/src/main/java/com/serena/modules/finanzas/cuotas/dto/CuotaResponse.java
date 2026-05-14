package com.serena.modules.finanzas.cuotas.dto;

import com.serena.modules.finanzas.cuotas.entity.Cuota;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CuotaResponse(
        Integer idCuota,
        Integer idPoliza,
        String polizaNombre,
        String polizaTipo,
        Integer numeroCuota,
        BigDecimal monto,
        LocalDate fechaVencimiento,
        String estadoPago
) {
    public static CuotaResponse from(Cuota c) {
        return new CuotaResponse(
                c.getIdCuota(),
                c.getPoliza().getIdPoliza(),
                c.getPoliza().getProducto().getNombre(),
                c.getPoliza().getProducto().getTipoSeguro().name(),
                c.getNumeroCuota(),
                c.getMonto(),
                c.getFechaVencimiento(),
                c.getEstadoPago().name()
        );
    }
}
