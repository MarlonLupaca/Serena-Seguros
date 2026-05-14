package com.serena.modules.seguridad.auth.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String username,
        String nombres,
        String apellidos,
        String portalAcceso
) {}
