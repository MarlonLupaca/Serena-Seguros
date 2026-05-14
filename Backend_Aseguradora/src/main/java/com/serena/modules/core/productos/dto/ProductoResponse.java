package com.serena.modules.core.productos.dto;

import com.serena.modules.core.productos.entity.ProductoSeguro;

import java.math.BigDecimal;

public record ProductoResponse(
        Integer idProducto,
        String nombre,
        String tipoSeguro,
        BigDecimal primaBase,
        String limitesCobertura,
        Integer restriccionesEdad,
        BigDecimal tasas,
        String estado
) {
    public static ProductoResponse from(ProductoSeguro p) {
        return new ProductoResponse(
                p.getIdProducto(),
                p.getNombre(),
                p.getTipoSeguro().name(),
                p.getPrimaBase(),
                p.getLimitesCobertura(),
                p.getRestriccionesEdad(),
                p.getTasas(),
                p.getEstado().name()
        );
    }
}
