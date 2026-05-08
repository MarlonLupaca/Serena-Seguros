package com.serena.modules.auth.service;

import com.serena.modules.auth.dto.request.LoginRequest;
import com.serena.modules.auth.dto.request.RegistroRequest;
import com.serena.modules.auth.dto.response.AuthResponse;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.mapper.UsuarioMapper;
import com.serena.modules.auth.repository.UsuarioRepository;
import com.serena.shared.config.JwtTokenProvider;
import com.serena.shared.exception.CredencialesInvalidasException;
import com.serena.shared.exception.UsuarioYaExisteException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse registro(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new UsuarioYaExisteException(request.email());
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.nombre())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        usuarioRepository.save(usuario);

        String accessToken = jwtTokenProvider
                .generarAccessToken(usuario.getId(), usuario.getEmail());
        String refreshToken = jwtTokenProvider
                .generarRefreshToken(usuario.getId());

        return usuarioMapper.toAuthResponse(
                usuario, accessToken, refreshToken
        );
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new CredencialesInvalidasException());

        if (!passwordEncoder.matches(
                request.password(), usuario.getPasswordHash()
        )) {
            throw new CredencialesInvalidasException();
        }

        String accessToken = jwtTokenProvider
                .generarAccessToken(usuario.getId(), usuario.getEmail());
        String refreshToken = jwtTokenProvider
                .generarRefreshToken(usuario.getId());

        return usuarioMapper.toAuthResponse(
                usuario, accessToken, refreshToken
        );
    }
}