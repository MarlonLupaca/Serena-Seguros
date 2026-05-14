package com.serena.shared.config.seeder;

import com.serena.modules.finanzas.activos.entity.ActivoInterno;
import com.serena.modules.finanzas.activos.repository.ActivoInternoRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.finanzas.presupuesto.entity.PresupuestoArea;
import com.serena.modules.finanzas.presupuesto.repository.PresupuestoAreaRepository;
import com.serena.modules.finanzas.tesoreria.entity.FlujoCaja;
import com.serena.modules.finanzas.tesoreria.repository.FlujoCajaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Order(4) // Se ejecuta en cuarto lugar
@RequiredArgsConstructor
public class BackofficeSeeder implements CommandLineRunner {

    private final PresupuestoAreaRepository presupuestoRepository;
    private final FlujoCajaRepository flujoCajaRepository;
    private final ActivoInternoRepository activoRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        crearOperativoDemo();
    }

    private void crearOperativoDemo() {
        // 1. Crear Presupuestos por Área
        if (presupuestoRepository.count() == 0) {
            String[][] areas = {
                    {"COMERCIAL", "150000"},
                    {"TECNICO",   "200000"},
                    {"OPERATIVO", "100000"},
                    {"EJECUTIVO",  "80000"},
                    {"MARKETING",  "50000"},
            };
            for (String[] a : areas) {
                presupuestoRepository.save(PresupuestoArea.builder()
                        .area(a[0])
                        .presupuestoAsignado(new BigDecimal(a[1]))
                        // Ejecutado al 40% para la demo
                        .montoEjecutado(new BigDecimal(a[1]).multiply(new BigDecimal("0.4")))
                        .alertasSobreconsumo(false)
                        .build());
            }
        }

        // 2. Crear Movimientos de Flujo de Caja
        if (flujoCajaRepository.count() == 0) {
            String[][] mov = {
                    {"INGRESO",  "Cobro primas mensuales",       "45000.00", "EJECUTADO"},
                    {"INGRESO",  "Cobro primas atrasadas",       "12000.00", "APROBADO"},
                    {"EGRESO",   "Pago comisiones agentes",      "18000.00", "EJECUTADO"},
                    {"EGRESO",   "Reembolso siniestros aprobados","32000.00", "APROBADO"},
                    {"EGRESO",   "Renovación licencias software","8500.00",  "PENDIENTE"},
                    {"INGRESO",  "Reaseguro recuperación",       "6500.00",  "PENDIENTE"},
            };
            LocalDate hoy = LocalDate.now();
            for (int i = 0; i < mov.length; i++) {
                String[] m = mov[i];
                flujoCajaRepository.save(FlujoCaja.builder()
                        .tipoFlujo(FlujoCaja.TipoFlujo.valueOf(m[0]))
                        .concepto(m[1])
                        .monto(new BigDecimal(m[2]))
                        .estadoAprobacion(FlujoCaja.EstadoAprobacion.valueOf(m[3]))
                        .fechaProgramada(hoy.minusDays(i * 5L)) // Fechas escalonadas hacia atrás
                        .build());
            }
        }

        // 3. Crear Activos Internos
        if (activoRepository.count() == 0) {
            // Buscamos cualquier empleado disponible para asignarle los activos
            Empleado empleadoDefault = empleadoRepository.findAll().stream().findFirst().orElse(null);

            String[][] activos = {
                    {"Laptop",     "Lenovo ThinkPad", "3500.00", "OPERATIVO"},
                    {"Monitor",    "Dell P2422H",     "1200.00", "OPERATIVO"},
                    {"Impresora",  "HP LaserJet",     "2100.00", "MANTENIMIENTO"},
                    {"Vehículo",   "Toyota Yaris",   "55000.00", "OPERATIVO"},
                    {"Servidor",   "HP ProLiant",   "12000.00", "OPERATIVO"},
            };
            for (String[] a : activos) {
                activoRepository.save(ActivoInterno.builder()
                        .empleadoAsignado(empleadoDefault)
                        .tipo(a[0])
                        .marca(a[1])
                        .valorDepreciacion(new BigDecimal(a[2]))
                        .estado(ActivoInterno.Estado.valueOf(a[3]))
                        .build());
            }
        }
    }
}