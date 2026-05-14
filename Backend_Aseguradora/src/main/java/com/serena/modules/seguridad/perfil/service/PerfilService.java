package com.serena.modules.seguridad.perfil.service;

import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.seguridad.perfil.dto.CambioPasswordRequest;
import com.serena.modules.seguridad.perfil.dto.PerfilResponse;
import com.serena.modules.seguridad.perfil.dto.PerfilUpdateRequest;
import com.serena.shared.exception.CredencialesInvalidasException;
import com.serena.shared.exception.RecursoNoEncontradoException;
import com.serena.shared.exception.UsuarioYaExisteException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PerfilResponse obtener(Usuario usuario) {
        Persona persona = personaRepository
                .findByUsuario(usuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Persona", usuario.getIdUsuario()));
        return mapear(usuario, persona);
    }

    @Transactional
    public PerfilResponse actualizar(Usuario usuario, PerfilUpdateRequest request) {
        Persona persona = personaRepository
                .findByUsuario(usuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Persona", usuario.getIdUsuario()));

        if (!persona.getEmail().equalsIgnoreCase(request.email())
                && personaRepository.existsByEmail(request.email())) {
            throw new UsuarioYaExisteException(request.email());
        }

        persona.setNombres(request.nombres());
        persona.setApellidos(request.apellidos());
        persona.setTelefono(request.telefono());
        persona.setEmail(request.email());
        personaRepository.save(persona);

        return mapear(usuario, persona);
    }

    @Transactional
    public void cambiarPassword(Usuario usuario, CambioPasswordRequest request) {
        if (!passwordEncoder.matches(request.passwordActual(), usuario.getPasswordHash())) {
            throw new CredencialesInvalidasException();
        }
        usuario.setPasswordHash(passwordEncoder.encode(request.passwordNueva()));
        usuarioRepository.save(usuario);
    }

    private PerfilResponse mapear(Usuario u, Persona p) {
        return new PerfilResponse(
                u.getIdUsuario(),
                u.getUsername(),
                u.getPortalAcceso().name(),
                u.getEstado().name(),
                p.getNombres(),
                p.getApellidos(),
                p.getDocumentoIdentidad(),
                p.getTelefono(),
                p.getEmail()
        );
    }
}
