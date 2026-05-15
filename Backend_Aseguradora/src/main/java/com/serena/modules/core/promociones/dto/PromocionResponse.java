package com.serena.modules.core.promociones.dto;

import com.serena.modules.core.promociones.entity.Promocion;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PromocionResponse(
        Integer idPromocion,
        Integer idProducto,
        String productoNombre,
        String productoTipo,
        String titulo,
        String descripcion,
        BigDecimal descuentoPct,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {
    public static PromocionResponse from(Promocion p) {
        return new PromocionResponse(
                p.getIdPromocion(),
                p.getProducto().getIdProducto(),
                p.getProducto().getNombre(),
                p.getProducto().getTipoSeguro().name(),
                p.getTitulo(),
                p.getDescripcion(),
                p.getDescuentoPct(),
                p.getFechaInicio(),
                p.getFechaFin()
        );
    }
}
