package com.serena.modules.seguridad.perfil.service;

import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.seguridad.perfil.dto.BeneficiarioRequest;
import com.serena.modules.seguridad.perfil.dto.BeneficiarioResponse;
import com.serena.modules.seguridad.perfil.dto.CambioPasswordRequest;
import com.serena.modules.seguridad.perfil.dto.PerfilResponse;
import com.serena.modules.seguridad.perfil.dto.PerfilUpdateRequest;
import com.serena.modules.seguridad.perfil.dto.PreferenciaRequest;
import com.serena.modules.seguridad.perfil.dto.PreferenciaResponse;
import com.serena.modules.seguridad.perfil.entity.Beneficiario;
import com.serena.modules.seguridad.perfil.entity.PreferenciaNotificacion;
import com.serena.modules.seguridad.perfil.repository.BeneficiarioRepository;
import com.serena.modules.seguridad.perfil.repository.PreferenciaNotificacionRepository;
import com.serena.shared.exception.CredencialesInvalidasException;
import com.serena.shared.exception.RecursoNoEncontradoException;
import com.serena.shared.exception.UsuarioYaExisteException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final BeneficiarioRepository beneficiarioRepository;
    private final PreferenciaNotificacionRepository preferenciaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PerfilResponse obtener(Usuario usuario) {
        Persona persona = persona(usuario);
        return mapear(usuario, persona);
    }

    @Transactional
    public PerfilResponse actualizar(Usuario usuario, PerfilUpdateRequest request) {
        Persona persona = persona(usuario);

        if (!persona.getEmail().equalsIgnoreCase(request.email())
                && personaRepository.existsByEmail(request.email())) {
            throw new UsuarioYaExisteException(request.email());
        }

        persona.setNombres(request.nombres());
        persona.setApellidos(request.apellidos());
        persona.setTelefono(request.telefono());
        persona.setEmail(request.email());
        persona.setContactoEmergenciaNombre(request.contactoEmergenciaNombre());
        persona.setContactoEmergenciaRelacion(request.contactoEmergenciaRelacion());
        persona.setContactoEmergenciaTelefono(request.contactoEmergenciaTelefono());
        persona.setContactoEmergenciaCorreo(request.contactoEmergenciaCorreo());
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

    @Transactional(readOnly = true)
    public List<BeneficiarioResponse> listarBeneficiarios(Usuario usuario) {
        Persona persona = persona(usuario);
        return beneficiarioRepository.findByPersonaOrderByIdBeneficiarioAsc(persona)
                .stream()
                .map(BeneficiarioResponse::from)
                .toList();
    }

    @Transactional
    public List<BeneficiarioResponse> reemplazarBeneficiarios(Usuario usuario, List<BeneficiarioRequest> request) {
        Persona persona = persona(usuario);
        beneficiarioRepository.deleteByPersona(persona);
        List<Beneficiario> nuevos = request.stream()
                .map(r -> Beneficiario.builder()
                        .persona(persona)
                        .nombres(r.nombres())
                        .apellidos(r.apellidos())
                        .parentesco(r.parentesco())
                        .documentoIdentidad(r.documentoIdentidad())
                        .porcentaje(r.porcentaje())
                        .build())
                .toList();
        return beneficiarioRepository.saveAll(nuevos)
                .stream()
                .map(BeneficiarioResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PreferenciaResponse obtenerPreferencias(Usuario usuario) {
        return preferenciaRepository.findByUsuario(usuario)
                .map(PreferenciaResponse::from)
                .orElseGet(PreferenciaResponse::defaultPreference);
    }

    @Transactional
    public PreferenciaResponse actualizarPreferencias(Usuario usuario, PreferenciaRequest request) {
        PreferenciaNotificacion pref = preferenciaRepository.findByUsuario(usuario)
                .orElseGet(() -> PreferenciaNotificacion.builder().usuario(usuario).build());
        pref.setNotifEmail(request.notifEmail());
        pref.setNotifSms(request.notifSms());
        pref.setNotifPush(request.notifPush());
        return PreferenciaResponse.from(preferenciaRepository.save(pref));
    }

    private Persona persona(Usuario usuario) {
        return personaRepository
                .findByUsuario(usuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Persona", usuario.getIdUsuario()));
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
                p.getEmail(),
                p.getContactoEmergenciaNombre(),
                p.getContactoEmergenciaRelacion(),
                p.getContactoEmergenciaTelefono(),
                p.getContactoEmergenciaCorreo()
        );
    }
}
