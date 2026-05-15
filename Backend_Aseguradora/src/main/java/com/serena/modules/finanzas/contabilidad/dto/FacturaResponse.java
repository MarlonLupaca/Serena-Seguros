package com.serena.modules.finanzas.contabilidad.dto;

import com.serena.modules.finanzas.contabilidad.entity.Factura;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FacturaResponse(
        Integer idFactura,
        String tipo,
        String serie,
        String numero,
        Integer idCliente,
        String clienteNombre,
        BigDecimal total,
        LocalDate fechaEmision,
        String estado
) {
    public static FacturaResponse from(Factura f) {
        String clienteNombre = null;
        Integer idCliente = null;
        if (f.getCliente() != null) {
            idCliente = f.getCliente().getIdCliente();
            var p = f.getCliente().getPersona();
            if (p != null) clienteNombre = p.getNombres() + " " + p.getApellidos();
        }
        return new FacturaResponse(
                f.getIdFactura(),
                f.getTipo().name(),
                f.getSerie(),
                f.getNumero(),
                idCliente,
                clienteNombre,
                f.getTotal(),
                f.getFechaEmision(),
                f.getEstado().name()
        );
    }
}
