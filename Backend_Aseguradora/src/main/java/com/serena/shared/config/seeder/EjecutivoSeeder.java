package com.serena.shared.config.seeder;

import com.serena.modules.ejecutivo.entity.AprobacionCritica;
import com.serena.modules.ejecutivo.entity.ObjetivoCorporativo;
import com.serena.modules.ejecutivo.repository.AprobacionCriticaRepository;
import com.serena.modules.ejecutivo.repository.ObjetivoCorporativoRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@Order(5) // Se ejecuta al final, una vez que toda la infraestructura base está lista
@RequiredArgsConstructor
public class EjecutivoSeeder implements CommandLineRunner {

    private final AprobacionCriticaRepository aprobacionRepository;
    private final ObjetivoCorporativoRepository objetivoRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        crearEjecutivoDemo();
    }

    private void crearEjecutivoDemo() {
        // 1. Crear Aprobaciones Críticas Pendientes
        if (aprobacionRepository.count() == 0) {
            String[][] datos = {
                    {"SINIESTROS",  "45000.00", "Reclamo por accidente vehicular - revisar documentos del taller"},
                    {"REASEGURO",   "120000.00","Renovacion contrato con Mapfre Re - condiciones modificadas"},
                    {"COMPRAS",     "18500.00", "Compra de servidores para la sede secundaria"},
                    {"CAMPANAS",    "9500.00",  "Pauta digital Q4 - Facebook y Google Ads"},
                    {"COMISIONES",  "32000.00", "Bonificacion extraordinaria a equipo comercial por cierre de Q3"},
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

        // 2. Crear Objetivos Corporativos (KPIs)
        if (objetivoRepository.count() == 0) {
            // Buscamos al primer empleado (probablemente el Gerente creado en SeguridadSeeder)
            Empleado responsable = empleadoRepository.findAll().stream().findFirst().orElse(null);
            if (responsable == null) return;

            Object[][] datos = {
                    {"Aumentar polizas activas a 1500",         "1500.00", "1245.00", ObjetivoCorporativo.Estado.EN_PROGRESO},
                    {"Reducir siniestralidad por debajo del 4%", "100.00",  "62.00",  ObjetivoCorporativo.Estado.EN_RIESGO},
                    {"Crecer cartera comercial 20%",             "120.00", "108.00",  ObjetivoCorporativo.Estado.EN_PROGRESO},
                    {"Cierre del 90% de aprobaciones en 48h",     "90.00",  "75.00",  ObjetivoCorporativo.Estado.RETRASADO},
                    {"Implementar 3 productos nuevos en el ano",   "3.00",   "3.00",  ObjetivoCorporativo.Estado.CUMPLIDO},
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
    }
}