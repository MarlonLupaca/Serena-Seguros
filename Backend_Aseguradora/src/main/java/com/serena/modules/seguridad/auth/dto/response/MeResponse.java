package com.serena.modules.seguridad.auth.dto.response;

public record MeResponse(
        String username,
        String nombres,
        String apellidos,
        String portalAcceso
) {}
