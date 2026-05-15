package com.serena.modules.finanzas.compras.dto;

import com.serena.modules.finanzas.compras.entity.OrdenCompra;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrdenCompraResponse(
        Integer idOrden,
        Integer idSolicitud,
        String solicitudProducto,
        Integer idProveedorInterno,
        String proveedorNombre,
        BigDecimal montoTotal,
        String estado,
        LocalDateTime fechaEmision
) {
    public static OrdenCompraResponse from(OrdenCompra o) {
        return new OrdenCompraResponse(
                o.getIdOrden(),
                o.getSolicitud().getIdSolicitud(),
                o.getSolicitud().getProducto(),
                o.getProveedor().getIdProveedorInterno(),
                o.getProveedor().getNombre(),
                o.getMontoTotal(),
                o.getEstado().name(),
                o.getFechaEmision()
        );
    }
}
