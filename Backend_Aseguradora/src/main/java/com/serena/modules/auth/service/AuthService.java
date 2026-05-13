package com.serena.modules.auth.service;

import com.serena.modules.auditoria.service.AuditoriaService;
import com.serena.modules.auth.dto.request.LoginRequest;
import com.serena.modules.auth.dto.request.RegistroRequest;
import com.serena.modules.auth.dto.response.AuthResponse;
import com.serena.modules.auth.dto.response.MeResponse;
import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.mapper.UsuarioMapper;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.auth.repository.UsuarioRepository;
import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.clientes.repository.ClienteRepository;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.empleados.repository.EmpleadoRepository;
import com.serena.shared.config.JwtTokenProvider;
import com.serena.shared.exception.CredencialesInvalidasException;
import com.serena.shared.exception.UsuarioYaExisteException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditoriaService auditoria;

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

        crearPerfilSegunPortal(persona, request.portalAcceso());

        String accessToken = jwtTokenProvider
                .generarAccessToken(usuario.getIdUsuario(), usuario.getUsername());
        String refreshToken = jwtTokenProvider
                .generarRefreshToken(usuario.getIdUsuario());

        auditoria.registrar(usuario.getIdUsuario(), usuario.getUsername(),
                "registro", "auth", "Portal: " + request.portalAcceso());

        return usuarioMapper.toAuthResponse(
                usuario, persona, accessToken, refreshToken
        );
    }

    @Transactional(readOnly = true)
    public MeResponse me(Usuario usuario) {
        Persona persona = personaRepository
                .findByUsuario(usuario)
                .orElseThrow(CredencialesInvalidasException::new);
        return new MeResponse(
                usuario.getUsername(),
                persona.getNombres(),
                persona.getApellidos(),
                usuario.getPortalAcceso().name()
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository
                .findByUsername(request.username())
                .orElseGet(() -> {
                    auditoria.registrar(null, request.username(), "login_fail", "auth", "Usuario inexistente");
                    throw new CredencialesInvalidasException();
                });

        if (usuario.getEstado() != Usuario.Estado.ACTIVO) {
            auditoria.registrar(usuario.getIdUsuario(), usuario.getUsername(), "login_fail", "auth",
                    "Estado: " + usuario.getEstado());
            throw new CredencialesInvalidasException();
        }

        if (!passwordEncoder.matches(
                request.password(), usuario.getPasswordHash()
        )) {
            auditoria.registrar(usuario.getIdUsuario(), usuario.getUsername(), "login_fail", "auth", "Password invalido");
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

        auditoria.registrar(usuario.getIdUsuario(), usuario.getUsername(), "login_ok", "auth", null);

        return usuarioMapper.toAuthResponse(
                usuario, persona, accessToken, refreshToken
        );
    }

    private void crearPerfilSegunPortal(Persona persona, Usuario.PortalAcceso portal) {
        if (portal == Usuario.PortalAcceso.ASEGURADO) {
            Cliente cliente = Cliente.builder()
                    .persona(persona)
                    .estadoCrm(Cliente.EstadoCrm.NUEVO)
                    .build();
            clienteRepository.save(cliente);
        } else {
            Empleado empleado = Empleado.builder()
                    .persona(persona)
                    .cargo("Por asignar")
                    .area(portal.name())
                    .sueldoBase(BigDecimal.ZERO)
                    .build();
            empleadoRepository.save(empleado);
        }
    }
}
