package com.serena.modules.auth.dto.response;

public record MeResponse(
        String username,
        String nombres,
        String apellidos,
        String portalAcceso
) {}
