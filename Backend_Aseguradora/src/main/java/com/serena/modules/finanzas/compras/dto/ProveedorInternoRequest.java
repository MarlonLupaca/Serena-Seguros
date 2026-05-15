package com.serena.modules.finanzas.compras.dto;

import com.serena.modules.finanzas.compras.entity.ProveedorInterno;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProveedorInternoRequest(
        @NotBlank @Size(max = 150) String nombre,
        @NotBlank @Size(max = 20) String ruc,
        @NotBlank @Size(max = 100) String rubro,
        @Size(max = 150) String contacto,
        @Size(max = 20) String telefono,
        @Email @Size(max = 100) String email,
        ProveedorInterno.Estado estado
) {}
