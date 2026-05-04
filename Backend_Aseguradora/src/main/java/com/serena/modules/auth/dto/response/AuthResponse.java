package com.ApiApuesta.auth.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String nombre,
        String plan
) {}