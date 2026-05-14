package com.serena.modules.core.polizas.dto;

import com.serena.modules.core.productos.entity.ProductoSeguro;

public record ProductoMini(
        Integer idProducto,
        String nombre,
        String tipoSeguro,
        String limitesCobertura
) {
    public static ProductoMini from(ProductoSeguro p) {
        return new ProductoMini(
                p.getIdProducto(),
                p.getNombre(),
                p.getTipoSeguro().name(),
                p.getLimitesCobertura()
        );
    }
}
