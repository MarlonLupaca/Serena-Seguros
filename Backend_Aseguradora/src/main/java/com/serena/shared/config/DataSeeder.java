package com.serena.shared.config;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.auth.repository.UsuarioRepository;
import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.clientes.repository.ClienteRepository;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.empleados.repository.EmpleadoRepository;
import com.serena.modules.activos.entity.ActivoInterno;
import com.serena.modules.activos.repository.ActivoInternoRepository;
import com.serena.modules.comisiones.entity.ComisionAgente;
import com.serena.modules.comisiones.repository.ComisionAgenteRepository;
import com.serena.modules.cuotas.entity.Cuota;
import com.serena.modules.cuotas.repository.CuotaRepository;
import com.serena.modules.ejecutivo.entity.AprobacionCritica;
import com.serena.modules.ejecutivo.entity.ObjetivoCorporativo;
import com.serena.modules.ejecutivo.repository.AprobacionCriticaRepository;
import com.serena.modules.ejecutivo.repository.ObjetivoCorporativoRepository;
import com.serena.modules.polizas.entity.Poliza;
import com.serena.modules.polizas.repository.PolizaRepository;
import com.serena.modules.presupuesto.entity.PresupuestoArea;
import com.serena.modules.presupuesto.repository.PresupuestoAreaRepository;
import com.serena.modules.productos.entity.ProductoSeguro;
import com.serena.modules.productos.repository.ProductoSeguroRepository;
import com.serena.modules.tesoreria.entity.FlujoCaja;
import com.serena.modules.tesoreria.repository.FlujoCajaRepository;
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
    private final ComisionAgenteRepository comisionRepository;
    private final ActivoInternoRepository activoRepository;
    private final PresupuestoAreaRepository presupuestoRepository;
    private final FlujoCajaRepository flujoCajaRepository;
    private final AprobacionCriticaRepository aprobacionRepository;
    private final ObjetivoCorporativoRepository objetivoRepository;
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
        crearComisionesDemo();
        crearOperativoDemo();
        crearEjecutivoDemo();
    }

    private void crearEjecutivoDemo() {
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

        if (objetivoRepository.count() == 0) {
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

    private void crearOperativoDemo() {
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
                        .montoEjecutado(new BigDecimal(a[1]).multiply(new BigDecimal("0.4")))
                        .alertasSobreconsumo(false)
                        .build());
            }
        }

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
                        .fechaProgramada(hoy.minusDays(i * 5L))
                        .build());
            }
        }

        if (activoRepository.count() == 0) {
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

    private void crearComisionesDemo() {
        Empleado comercial = usuarioRepository.findByUsername("comercial_demo")
                .flatMap(u -> personaRepository.findByUsuario(u))
                .flatMap(p -> empleadoRepository.findByPersona(p))
                .orElse(null);
        if (comercial == null) return;

        polizaRepository.findAll().forEach(poliza -> {
            if (comisionRepository.findByPoliza(poliza).isPresent()) return;
            BigDecimal porcentaje = new BigDecimal("5.00");
            BigDecimal monto = poliza.getPrimaTotal()
                    .multiply(porcentaje)
                    .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
            ComisionAgente.EstadoPago estado = poliza.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA
                    ? ComisionAgente.EstadoPago.PAGADA
                    : ComisionAgente.EstadoPago.PENDIENTE;
            comisionRepository.save(ComisionAgente.builder()
                    .empleadoAgente(comercial)
                    .poliza(poliza)
                    .porcentaje(porcentaje)
                    .montoGenerado(monto)
                    .estadoPago(estado)
                    .build());
        });
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
