package com.serena.shared.config;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.auth.repository.UsuarioRepository;
import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.clientes.repository.ClienteRepository;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.empleados.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
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
        Usuario usuario = usuarioRepository.findByUsername(username).orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username(username)
                        .passwordHash(passwordEncoder.encode("demo12345"))
                        .portalAcceso(portal)
                        .estado(Usuario.Estado.ACTIVO)
                        .build())
        );

        Persona persona = personaRepository.findByUsuario(usuario).orElseGet(() ->
                personaRepository.save(Persona.builder()
                        .usuario(usuario)
                        .nombres(nombres)
                        .apellidos(apellidos)
                        .documentoIdentidad(documento)
                        .telefono("999000000")
                        .email(username + "@serena.com")
                        .build())
        );

        if (portal == Usuario.PortalAcceso.ASEGURADO) {
            if (clienteRepository.findByPersona(persona).isEmpty()) {
                clienteRepository.save(Cliente.builder()
                        .persona(persona)
                        .estadoCrm(Cliente.EstadoCrm.CLIENTE)
                        .build());
            }
        } else {
            if (empleadoRepository.findByPersona(persona).isEmpty()) {
                empleadoRepository.save(Empleado.builder()
                        .persona(persona)
                        .cargo("Demo " + portal.name().toLowerCase())
                        .area(portal.name())
                        .sueldoBase(new BigDecimal("3000.00"))
                        .build());
            }
        }
    }
}
