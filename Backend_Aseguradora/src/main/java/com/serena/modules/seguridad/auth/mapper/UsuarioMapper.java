package com.serena.modules.seguridad.auth.mapper;

import com.serena.modules.seguridad.auth.dto.response.AuthResponse;
import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
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
