package com.ApiApuesta.auth.mapper;

import com.ApiApuesta.auth.dto.response.AuthResponse;
import com.ApiApuesta.auth.entity.Usuario;
import org.springframework.stereotype.Component;

// mapper/UsuarioMapper.java
@Component
public class UsuarioMapper {

    public AuthResponse toAuthResponse(Usuario usuario,
                                       String accessToken,
                                       String refreshToken) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                usuario.getNombre(),
                usuario.getPlan().name()
        );
    }
}