package com.serena.modules.auth.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String username,
        String nombres,
        String apellidos,
        String portalAcceso
) {}
