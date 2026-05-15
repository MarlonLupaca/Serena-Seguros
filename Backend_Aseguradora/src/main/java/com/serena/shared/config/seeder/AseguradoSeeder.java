package com.serena.shared.config.seeder;

import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import com.serena.modules.core.promociones.entity.Promocion;
import com.serena.modules.core.promociones.repository.PromocionRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.seguridad.perfil.entity.Beneficiario;
import com.serena.modules.seguridad.perfil.entity.PreferenciaNotificacion;
import com.serena.modules.seguridad.perfil.repository.BeneficiarioRepository;
import com.serena.modules.seguridad.perfil.repository.PreferenciaNotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@Order(7)
@RequiredArgsConstructor
public class AseguradoSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final BeneficiarioRepository beneficiarioRepository;
    private final PreferenciaNotificacionRepository preferenciaRepository;
    private final PromocionRepository promocionRepository;
    private final ProductoSeguroRepository productoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        crearPreferenciasDemo();
        crearBeneficiariosDemo();
        crearPromocionesDemo();
    }

    private void crearPreferenciasDemo() {
        usuarioRepository.findAll().forEach(usuario -> {
            if (preferenciaRepository.findByUsuario(usuario).isEmpty()) {
                preferenciaRepository.save(PreferenciaNotificacion.builder()
                        .usuario(usuario)
                        .notifEmail(true)
                        .notifSms(usuario.getPortalAcceso() == Usuario.PortalAcceso.ASEGURADO)
                        .notifPush(true)
                        .build());
            }
        });
    }

    private void crearBeneficiariosDemo() {
        usuarioRepository.findByUsername("asegurado_demo").ifPresent(usuario ->
                personaRepository.findByUsuario(usuario).ifPresent(persona -> {
                    if (!beneficiarioRepository.findByPersonaOrderByIdBeneficiarioAsc(persona).isEmpty()) return;
                    List<Beneficiario> demo = List.of(
                            Beneficiario.builder()
                                    .persona(persona)
                                    .nombres("Lucia")
                                    .apellidos("Asegurada Perez")
                                    .parentesco("Hija")
                                    .documentoIdentidad("20000001")
                                    .porcentaje(new BigDecimal("40.00"))
                                    .build(),
                            Beneficiario.builder()
                                    .persona(persona)
                                    .nombres("Mateo")
                                    .apellidos("Asegurado Perez")
                                    .parentesco("Hijo")
                                    .documentoIdentidad("20000002")
                                    .porcentaje(new BigDecimal("30.00"))
                                    .build(),
                            Beneficiario.builder()
                                    .persona(persona)
                                    .nombres("Pedro")
                                    .apellidos("Asegurado Senior")
                                    .parentesco("Padre")
                                    .documentoIdentidad("20000003")
                                    .porcentaje(new BigDecimal("10.00"))
                                    .build(),
                            Beneficiario.builder()
                                    .persona(persona)
                                    .nombres("Rosa")
                                    .apellidos("Familiar Lima")
                                    .parentesco("Madre")
                                    .documentoIdentidad("20000004")
                                    .porcentaje(new BigDecimal("10.00"))
                                    .build(),
                            Beneficiario.builder()
                                    .persona(persona)
                                    .nombres("Camila")
                                    .apellidos("Asegurada Joven")
                                    .parentesco("Hermana")
                                    .documentoIdentidad("20000005")
                                    .porcentaje(new BigDecimal("10.00"))
                                    .build()
                    );
                    beneficiarioRepository.saveAll(demo);
                })
        );
    }

    private void crearPromocionesDemo() {
        if (promocionRepository.count() > 0) return;
        List<ProductoSeguro> productos = productoRepository.findAll();
        if (productos.isEmpty()) return;
        LocalDate hoy = LocalDate.now();

        crear(productos.get(0), "Auto sin enganche 20%", "Descuento solo para nuevos clientes vehiculares.",
                new BigDecimal("20.00"), hoy.minusDays(5), hoy.plusDays(25));

        if (productos.size() > 1) crear(productos.get(1), "Salud familiar - mes gratis",
                "Contrata salud premium y obten un mes sin costo.",
                new BigDecimal("15.00"), hoy.minusDays(10), hoy.plusDays(20));

        if (productos.size() > 2) crear(productos.get(2), "Vida + Ahorro",
                "Inversion respaldada con cobertura extendida.",
                new BigDecimal("10.00"), hoy.minusDays(3), hoy.plusDays(30));

        if (productos.size() > 3) crear(productos.get(3), "Hogar protegido al 100%",
                "Renueva tu hogar con cobertura total a precio especial.",
                new BigDecimal("12.50"), hoy.minusDays(1), hoy.plusDays(45));

        if (productos.size() > 4) crear(productos.get(4), "Viaje internacional 25% off",
                "Viaja seguro a cualquier destino con respaldo total.",
                new BigDecimal("25.00"), hoy.minusDays(2), hoy.plusDays(15));
    }

    private void crear(ProductoSeguro producto, String titulo, String descripcion,
                       BigDecimal descuentoPct, LocalDate inicio, LocalDate fin) {
        promocionRepository.save(Promocion.builder()
                .producto(producto)
                .titulo(titulo)
                .descripcion(descripcion)
                .descuentoPct(descuentoPct)
                .fechaInicio(inicio)
                .fechaFin(fin)
                .activa(true)
                .build());
    }
}
