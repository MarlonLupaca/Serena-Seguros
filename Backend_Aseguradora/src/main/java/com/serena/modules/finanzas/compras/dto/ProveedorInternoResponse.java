package com.serena.modules.finanzas.compras.dto;

import com.serena.modules.finanzas.compras.entity.ProveedorInterno;

public record ProveedorInternoResponse(
        Integer idProveedorInterno,
        String nombre,
        String ruc,
        String rubro,
        String contacto,
        String telefono,
        String email,
        String estado
) {
    public static ProveedorInternoResponse from(ProveedorInterno p) {
        return new ProveedorInternoResponse(
                p.getIdProveedorInterno(),
                p.getNombre(),
                p.getRuc(),
                p.getRubro(),
                p.getContacto(),
                p.getTelefono(),
                p.getEmail(),
                p.getEstado().name()
        );
    }
}
