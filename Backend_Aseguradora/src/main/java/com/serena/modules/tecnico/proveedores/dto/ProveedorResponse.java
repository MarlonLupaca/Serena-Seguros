package com.serena.modules.tecnico.proveedores.dto;

import com.serena.modules.tecnico.proveedores.entity.ProveedorRed;

import java.math.BigDecimal;

public record ProveedorResponse(
        Integer idProveedor,
        String rubro,
        String nombre,
        String ciudad,
        BigDecimal ratingInterno,
        String estado
) {
    public static ProveedorResponse from(ProveedorRed p) {
        return new ProveedorResponse(
                p.getIdProveedor(),
                p.getRubro().name(),
                p.getNombre(),
                p.getCiudad(),
                p.getRatingInterno(),
                p.getEstado().name()
        );
    }
}
