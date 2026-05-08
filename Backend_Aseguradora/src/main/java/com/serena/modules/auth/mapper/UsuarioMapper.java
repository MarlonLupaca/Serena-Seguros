package com.serena.modules.auth.mapper;

import com.serena.modules.auth.dto.response.AuthResponse;
import com.serena.modules.auth.entity.Usuario;
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