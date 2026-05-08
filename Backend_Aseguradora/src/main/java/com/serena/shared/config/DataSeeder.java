package com.serena.shared.config;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.auth.repository.UsuarioRepository;
import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.clientes.repository.ClienteRepository;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.empleados.repository.EmpleadoRepository;
import com.serena.modules.cuotas.entity.Cuota;
import com.serena.modules.cuotas.repository.CuotaRepository;
import com.serena.modules.polizas.entity.Poliza;
import com.serena.modules.polizas.repository.PolizaRepository;
import com.serena.modules.productos.entity.ProductoSeguro;
import com.serena.modules.productos.repository.ProductoSeguroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PolizaRepository polizaRepository;
    private final ProductoSeguroRepository productoRepository;
    private final CuotaRepository cuotaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        crearDemo("asegurado_demo", "Ana", "Asegurada", "10000001", Usuario.PortalAcceso.ASEGURADO);
        crearDemo("comercial_demo", "Carlos", "Comercial", "10000002", Usuario.PortalAcceso.COMERCIAL);
        crearDemo("tecnico_demo",   "Tomas", "Tecnico",    "10000003", Usuario.PortalAcceso.TECNICO);
        crearDemo("operativo_demo", "Olga",  "Operativa",  "10000004", Usuario.PortalAcceso.OPERATIVO);
        crearDemo("ejecutivo_demo", "Elena", "Ejecutiva",  "10000005", Usuario.PortalAcceso.EJECUTIVO);

        crearPolizasDemo();
        crearCuotasDemo();
    }

    private void crearCuotasDemo() {
        polizaRepository.findAll().forEach(poliza -> {
            if (poliza.getEstadoPoliza() != Poliza.EstadoPoliza.ACTIVA) return;
            if (!cuotaRepository.findByPolizaOrderByNumeroCuotaAsc(poliza).isEmpty()) return;

            BigDecimal montoCuota = poliza.getPrimaTotal()
                    .divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP);
            LocalDate hoy = LocalDate.now();
            for (int i = 1; i <= 12; i++) {
                LocalDate vencimiento = poliza.getVigenciaInicio().plusMonths(i - 1);
                Cuota.EstadoPago estado = vencimiento.isBefore(hoy)
                        ? Cuota.EstadoPago.PAGADO
                        : Cuota.EstadoPago.PENDIENTE;
                cuotaRepository.save(Cuota.builder()
                        .poliza(poliza)
                        .numeroCuota(i)
                        .monto(montoCuota)
                        .fechaVencimiento(vencimiento)
                        .estadoPago(estado)
                        .build());
            }
        });
    }

    private void crearPolizasDemo() {
        clienteRepository.findAll().forEach(cliente -> {
            if (!polizaRepository.findByClienteOrderByFechaEmisionDesc(cliente).isEmpty()) return;
            crearPolizaDemo(cliente, 1, new BigDecimal("1500.00"),
                    Poliza.EstadoPoliza.ACTIVA,
                    LocalDate.now().minusMonths(2),
                    LocalDate.now().plusMonths(10));
            crearPolizaDemo(cliente, 4, new BigDecimal("3600.00"),
                    Poliza.EstadoPoliza.ACTIVA,
                    LocalDate.now().minusMonths(1),
                    LocalDate.now().plusMonths(11));
            crearPolizaDemo(cliente, 5, new BigDecimal("250.00"),
                    Poliza.EstadoPoliza.PENDIENTE,
                    LocalDate.now().plusDays(3),
                    LocalDate.now().plusDays(33));
        });
    }

    private void crearPolizaDemo(Cliente cliente,
                                 Integer idProducto,
                                 BigDecimal primaTotal,
                                 Poliza.EstadoPoliza estado,
                                 LocalDate inicio,
                                 LocalDate fin) {
        ProductoSeguro producto = productoRepository.findById(idProducto).orElse(null);
        if (producto == null) return;
        polizaRepository.save(Poliza.builder()
                .cliente(cliente)
                .producto(producto)
                .primaTotal(primaTotal)
                .estadoPoliza(estado)
                .vigenciaInicio(inicio)
                .vigenciaFin(fin)
                .build());
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
