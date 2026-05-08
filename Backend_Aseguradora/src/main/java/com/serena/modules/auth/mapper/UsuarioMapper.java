package com.serena.modules.auth.mapper;

import com.serena.modules.auth.dto.response.AuthResponse;
import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public AuthResponse toAuthResponse(Usuario usuario,
                                       Persona persona,
                                       String accessToken,
                                       String refreshToken) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                usuario.getUsername(),
                persona.getNombres(),
                persona.getApellidos(),
                usuario.getPortalAcceso().name()
        );
    }
}
