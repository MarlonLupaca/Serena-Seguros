package com.serena.modules.perfil.dto;

public record PerfilResponse(
        Integer idUsuario,
        String username,
        String portalAcceso,
        String estado,
        String nombres,
        String apellidos,
        String documentoIdentidad,
        String telefono,
        String email
) {}
