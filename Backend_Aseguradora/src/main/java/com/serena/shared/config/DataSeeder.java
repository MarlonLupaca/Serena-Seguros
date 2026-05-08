package com.serena.shared.config;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        crearDemo("asegurado_demo", "Ana", "Asegurada", "10000001", Usuario.PortalAcceso.ASEGURADO);
        crearDemo("comercial_demo", "Carlos", "Comercial", "10000002", Usuario.PortalAcceso.COMERCIAL);
        crearDemo("tecnico_demo",   "Tomas", "Tecnico",    "10000003", Usuario.PortalAcceso.TECNICO);
        crearDemo("operativo_demo", "Olga",  "Operativa",  "10000004", Usuario.PortalAcceso.OPERATIVO);
        crearDemo("ejecutivo_demo", "Elena", "Ejecutiva",  "10000005", Usuario.PortalAcceso.EJECUTIVO);
    }

    private void crearDemo(String username,
                           String nombres,
                           String apellidos,
                           String documento,
                           Usuario.PortalAcceso portal) {
        if (usuarioRepository.existsByUsername(username)) {
            return;
        }

        Usuario usuario = Usuario.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode("demo12345"))
                .portalAcceso(portal)
                .estado(Usuario.Estado.ACTIVO)
                .build();
        usuarioRepository.save(usuario);

        Persona persona = Persona.builder()
                .usuario(usuario)
                .nombres(nombres)
                .apellidos(apellidos)
                .documentoIdentidad(documento)
                .telefono("999000000")
                .email(username + "@serena.com")
                .build();
        personaRepository.save(persona);
    }
}
