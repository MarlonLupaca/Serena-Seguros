package com.serena.shared.config.seeder;

import com.serena.modules.ejecutivo.entity.AprobacionCritica;
import com.serena.modules.ejecutivo.entity.ObjetivoCorporativo;
import com.serena.modules.ejecutivo.repository.AprobacionCriticaRepository;
import com.serena.modules.ejecutivo.repository.ObjetivoCorporativoRepository;
import com.serena.modules.ejecutivo.riesgos.entity.RiesgoCorporativo;
import com.serena.modules.ejecutivo.riesgos.repository.RiesgoRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@Order(5)
@RequiredArgsConstructor
public class EjecutivoSeeder implements CommandLineRunner {

    private final AprobacionCriticaRepository aprobacionRepository;
    private final ObjetivoCorporativoRepository objetivoRepository;
    private final RiesgoRepository riesgoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public void run(String... args) {
        crearAprobacionesDemo();
        crearObjetivosDemo();
        crearRiesgosDemo();
    }

    private void crearAprobacionesDemo() {
        if (aprobacionRepository.count() > 0) return;
        String[][] datos = {
                {"SINIESTROS", "45000.00", "Reclamo por accidente vehicular - revisar documentos del taller"},
                {"REASEGURO", "120000.00", "Renovacion contrato con Mapfre Re - condiciones modificadas"},
                {"COMPRAS", "18500.00", "Compra de servidores para la sede secundaria"},
                {"CAMPANAS", "9500.00", "Pauta digital Q4 - Facebook y Google Ads"},
                {"COMISIONES", "32000.00", "Bonificacion extraordinaria a equipo comercial por cierre de Q3"},
        };
        for (String[] d : datos) {
            aprobacionRepository.save(AprobacionCritica.builder()
                    .moduloOrigen(d[0])
                    .montoImpacto(new BigDecimal(d[1]))
                    .comentariosPrevios(d[2])
                    .estadoGerencial(AprobacionCritica.EstadoGerencial.PENDIENTE)
                    .fechaSolicitud(java.time.LocalDateTime.now())
                    .build());
        }
    }

    private void crearObjetivosDemo() {
        if (objetivoRepository.count() > 0) return;
        Empleado responsable = empleadoRepository.findAll().stream().findFirst().orElse(null);
        if (responsable == null) return;

        Object[][] datos = {
                {"Aumentar polizas activas a 1500", "1500.00", "1245.00", ObjetivoCorporativo.Estado.EN_PROGRESO},
                {"Reducir siniestralidad por debajo del 4%", "100.00", "62.00", ObjetivoCorporativo.Estado.EN_RIESGO},
                {"Crecer cartera comercial 20%", "120.00", "108.00", ObjetivoCorporativo.Estado.EN_PROGRESO},
                {"Cierre del 90% de aprobaciones en 48h", "90.00", "75.00", ObjetivoCorporativo.Estado.RETRASADO},
                {"Implementar 3 productos nuevos en el ano", "3.00", "3.00", ObjetivoCorporativo.Estado.CUMPLIDO},
        };
        for (Object[] d : datos) {
            objetivoRepository.save(ObjetivoCorporativo.builder()
                    .empleadoResponsable(responsable)
                    .descripcion((String) d[0])
                    .metaCuantitativa(new BigDecimal((String) d[1]))
                    .avanceActual(new BigDecimal((String) d[2]))
                    .estado((ObjetivoCorporativo.Estado) d[3])
                    .build());
        }
    }

    private void crearRiesgosDemo() {
        if (riesgoRepository.count() >= 5) return;
        Usuario autor = usuarioRepository.findByUsername("ejecutivo_demo").orElse(null);

        guardarRiesgo(RiesgoCorporativo.Tipo.CONCENTRACION, RiesgoCorporativo.Severidad.ALTA, "Comercial",
                "Mas del 55% de las polizas vendidas en Lima provienen del producto Vehicular. Riesgo de saturacion del mercado.",
                autor);
        guardarRiesgo(RiesgoCorporativo.Tipo.SINIESTRALIDAD, RiesgoCorporativo.Severidad.MEDIA, "Tecnico",
                "Incremento del 12% en siniestros vehiculares en la zona norte durante el ultimo trimestre.",
                autor);
        guardarRiesgo(RiesgoCorporativo.Tipo.MORA, RiesgoCorporativo.Severidad.MEDIA, "Finanzas",
                "Cartera morosa supera el 8%. Reforzar campania de cobranza preventiva antes del cierre del semestre.",
                autor);
        guardarRiesgo(RiesgoCorporativo.Tipo.PROVEEDOR, RiesgoCorporativo.Severidad.ALTA, "Operaciones",
                "Dependencia de un solo taller para reparaciones vehiculares en Lima Sur. Buscar al menos dos alternativas.",
                autor);
        guardarRiesgo(RiesgoCorporativo.Tipo.REGULATORIO, RiesgoCorporativo.Severidad.CRITICA, "Cumplimiento",
                "Nueva resolucion SBS exige reportes mensuales de reservas tecnicas. Plazo de adecuacion: 60 dias.",
                autor);
    }

    private void guardarRiesgo(RiesgoCorporativo.Tipo tipo, RiesgoCorporativo.Severidad sev,
                                String area, String descripcion, Usuario autor) {
        riesgoRepository.save(RiesgoCorporativo.builder()
                .tipo(tipo).severidad(sev).areaAfectada(area)
                .descripcion(descripcion).registradoPor(autor)
                .build());
    }
}
