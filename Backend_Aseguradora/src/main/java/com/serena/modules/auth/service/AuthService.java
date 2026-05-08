package com.serena.modules.auth.service;

import com.serena.modules.auth.dto.request.LoginRequest;
import com.serena.modules.auth.dto.request.RegistroRequest;
import com.serena.modules.auth.dto.response.AuthResponse;
import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.mapper.UsuarioMapper;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.auth.repository.UsuarioRepository;
import com.serena.shared.config.JwtTokenProvider;
import com.serena.shared.exception.CredencialesInvalidasException;
import com.serena.shared.exception.UsuarioYaExisteException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse registro(RegistroRequest request) {
        if (usuarioRepository.existsByUsername(request.username())) {
            throw new UsuarioYaExisteException(request.username());
        }
        if (personaRepository.existsByEmail(request.email())) {
            throw new UsuarioYaExisteException(request.email());
        }
        if (personaRepository.existsByDocumentoIdentidad(request.documentoIdentidad())) {
            throw new UsuarioYaExisteException(request.documentoIdentidad());
        }

        Usuario usuario = Usuario.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .portalAcceso(request.portalAcceso())
                .estado(Usuario.Estado.ACTIVO)
                .build();
        usuarioRepository.save(usuario);

        Persona persona = Persona.builder()
                .usuario(usuario)
                .nombres(request.nombres())
                .apellidos(request.apellidos())
                .documentoIdentidad(request.documentoIdentidad())
                .telefono(request.telefono())
                .email(request.email())
                .build();
        personaRepository.save(persona);

        String accessToken = jwtTokenProvider
                .generarAccessToken(usuario.getIdUsuario(), usuario.getUsername());
        String refreshToken = jwtTokenProvider
                .generarRefreshToken(usuario.getIdUsuario());

        return usuarioMapper.toAuthResponse(
                usuario, persona, accessToken, refreshToken
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository
                .findByUsername(request.username())
                .orElseThrow(CredencialesInvalidasException::new);

        if (usuario.getEstado() != Usuario.Estado.ACTIVO) {
            throw new CredencialesInvalidasException();
        }

        if (!passwordEncoder.matches(
                request.password(), usuario.getPasswordHash()
        )) {
            throw new CredencialesInvalidasException();
        }

        Persona persona = personaRepository
                .findByUsuario(usuario)
                .orElseThrow(CredencialesInvalidasException::new);

        usuario.setUltimoAcceso(LocalDateTime.now());

        String accessToken = jwtTokenProvider
                .generarAccessToken(usuario.getIdUsuario(), usuario.getUsername());
        String refreshToken = jwtTokenProvider
                .generarRefreshToken(usuario.getIdUsuario());

        return usuarioMapper.toAuthResponse(
                usuario, persona, accessToken, refreshToken
        );
    }
}
