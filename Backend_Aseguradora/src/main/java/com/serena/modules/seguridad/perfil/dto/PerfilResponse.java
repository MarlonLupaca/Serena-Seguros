package com.serena.modules.seguridad.perfil.dto;

public record PerfilResponse(
        Integer idUsuario,
        String username,
        String portalAcceso,
        String estado,
        String nombres,
        String apellidos,
        String documentoIdentidad,
        String telefono,
        String email,
        String contactoEmergenciaNombre,
        String contactoEmergenciaRelacion,
        String contactoEmergenciaTelefono,
        String contactoEmergenciaCorreo
) {}
