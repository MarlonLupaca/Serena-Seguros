package com.serena.shared.config.seeder;

import com.serena.modules.finanzas.compras.entity.OrdenCompra;
import com.serena.modules.finanzas.compras.entity.ProveedorInterno;
import com.serena.modules.finanzas.compras.entity.SolicitudCompra;
import com.serena.modules.finanzas.compras.repository.OrdenCompraRepository;
import com.serena.modules.finanzas.compras.repository.ProveedorInternoRepository;
import com.serena.modules.finanzas.compras.repository.SolicitudCompraRepository;
import com.serena.modules.finanzas.contabilidad.entity.AsientoContable;
import com.serena.modules.finanzas.contabilidad.entity.CuentaContable;
import com.serena.modules.finanzas.contabilidad.entity.Factura;
import com.serena.modules.finanzas.contabilidad.entity.MovimientoContable;
import com.serena.modules.finanzas.contabilidad.repository.AsientoContableRepository;
import com.serena.modules.finanzas.contabilidad.repository.CuentaContableRepository;
import com.serena.modules.finanzas.contabilidad.repository.FacturaRepository;
import com.serena.modules.finanzas.contabilidad.repository.MovimientoContableRepository;
import com.serena.modules.finanzas.nomina.dto.ProcesarPlanillaRequest;
import com.serena.modules.finanzas.nomina.repository.PlanillaMensualRepository;
import com.serena.modules.finanzas.nomina.service.NominaService;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Component
@Order(9)
@RequiredArgsConstructor
public class OperativoSeeder implements CommandLineRunner {

    private final PlanillaMensualRepository planillaRepo;
    private final NominaService nominaService;
    private final ProveedorInternoRepository proveedorRepo;
    private final SolicitudCompraRepository solicitudRepo;
    private final OrdenCompraRepository ordenRepo;
    private final CuentaContableRepository cuentaRepo;
    private final AsientoContableRepository asientoRepo;
    private final MovimientoContableRepository movimientoRepo;
    private final FacturaRepository facturaRepo;
    private final EmpleadoRepository empleadoRepo;
    private final ClienteRepository clienteRepo;

    @Override
    @Transactional
    public void run(String... args) {
        completarEmpleadosBase();
        crearProveedoresInternos();
        crearSolicitudesYOrdenes();
        crearCuentasContables();
        crearAsientos();
        crearFacturas();
        procesarPlanillaMesActual();
    }

    private void completarEmpleadosBase() {
        empleadoRepo.findAll().forEach(e -> {
            if (e.getFechaIngreso() == null) {
                e.setFechaIngreso(LocalDate.now().minusYears(2));
            }
            if (e.getEstadoEmpleado() == null) {
                e.setEstadoEmpleado(Empleado.EstadoEmpleado.ACTIVO);
            }
            empleadoRepo.save(e);
        });
    }

    private void crearProveedoresInternos() {
        if (proveedorRepo.count() >= 5) return;
        crearProveedor("Suministros Andinos SAC", "20512345671", "Oficina", "Lucia Diaz", "987654001", "ventas@andinos.pe");
        crearProveedor("TI Soluciones Peru", "20512345672", "Tecnologia", "Pedro Mejia", "987654002", "comercial@tisoluciones.pe");
        crearProveedor("Servicios Generales Lima", "20512345673", "Servicios", "Sara Aliaga", "987654003", "contacto@sglima.pe");
        crearProveedor("Mobiliario Corporativo", "20512345674", "Mobiliario", "Jose Tello", "987654004", "ventas@mobiliario.pe");
        crearProveedor("Marketing 360", "20512345675", "Marketing", "Rosa Cabrera", "987654005", "info@marketing360.pe");
    }

    private void crearProveedor(String nombre, String ruc, String rubro, String contacto, String tel, String email) {
        if (proveedorRepo.findAllByOrderByNombreAsc().stream().anyMatch(p -> p.getRuc().equals(ruc))) return;
        proveedorRepo.save(ProveedorInterno.builder()
                .nombre(nombre).ruc(ruc).rubro(rubro).contacto(contacto).telefono(tel).email(email)
                .estado(ProveedorInterno.Estado.ACTIVO).build());
    }

    private void crearSolicitudesYOrdenes() {
        if (solicitudRepo.count() >= 5) return;

        Empleado solicitante = empleadoRepo.findAll().stream().findFirst().orElse(null);

        SolicitudCompra s1 = guardarSolicitud("TI", "Laptops para nuevos empleados", "5 laptops Ryzen 7", "12500.00", SolicitudCompra.Prioridad.ALTA, SolicitudCompra.Estado.APROBADO, solicitante);
        SolicitudCompra s2 = guardarSolicitud("Marketing", "Campaña digital Q3", "Pauta en redes sociales por 3 meses", "8500.00", SolicitudCompra.Prioridad.MEDIA, SolicitudCompra.Estado.COMPRADO, solicitante);
        guardarSolicitud("Operaciones", "Mobiliario sala de reuniones", "Mesa y 8 sillas ergonomicas", "4200.00", SolicitudCompra.Prioridad.BAJA, SolicitudCompra.Estado.PENDIENTE, solicitante);
        guardarSolicitud("RRHH", "Capacitacion de liderazgo", "Curso externo para 4 jefaturas", "3600.00", SolicitudCompra.Prioridad.MEDIA, SolicitudCompra.Estado.RECHAZADO, solicitante);
        guardarSolicitud("Finanzas", "Auditoria externa", "Servicio anual de auditoria", "15000.00", SolicitudCompra.Prioridad.ALTA, SolicitudCompra.Estado.PENDIENTE, solicitante);

        if (ordenRepo.count() == 0) {
            var prov = proveedorRepo.findAllByOrderByNombreAsc().stream().findFirst().orElse(null);
            var provMarketing = proveedorRepo.findAllByOrderByNombreAsc().stream()
                    .filter(p -> p.getRubro().equalsIgnoreCase("Marketing")).findFirst().orElse(prov);
            if (s1 != null && prov != null) {
                ordenRepo.save(OrdenCompra.builder()
                        .solicitud(s1).proveedor(prov).montoTotal(new BigDecimal("12500.00"))
                        .estado(OrdenCompra.Estado.EMITIDA).build());
            }
            if (s2 != null && provMarketing != null) {
                ordenRepo.save(OrdenCompra.builder()
                        .solicitud(s2).proveedor(provMarketing).montoTotal(new BigDecimal("8500.00"))
                        .estado(OrdenCompra.Estado.RECIBIDA).build());
            }
        }
    }

    private SolicitudCompra guardarSolicitud(String area, String producto, String desc, String monto,
                                              SolicitudCompra.Prioridad prio, SolicitudCompra.Estado estado, Empleado solicitante) {
        return solicitudRepo.save(SolicitudCompra.builder()
                .area(area).producto(producto).descripcion(desc)
                .montoEstimado(new BigDecimal(monto)).prioridad(prio).estado(estado)
                .empleadoSolicitante(solicitante).build());
    }

    private void crearCuentasContables() {
        if (cuentaRepo.count() >= 5) return;
        crearCuenta("1010", "Caja y bancos", CuentaContable.Tipo.ACTIVO);
        crearCuenta("1210", "Cuentas por cobrar", CuentaContable.Tipo.ACTIVO);
        crearCuenta("2010", "Cuentas por pagar", CuentaContable.Tipo.PASIVO);
        crearCuenta("3010", "Capital social", CuentaContable.Tipo.PATRIMONIO);
        crearCuenta("4010", "Ingresos por primas", CuentaContable.Tipo.INGRESO);
        crearCuenta("5010", "Gastos operativos", CuentaContable.Tipo.GASTO);
        crearCuenta("5020", "Gastos de personal", CuentaContable.Tipo.GASTO);
    }

    private void crearCuenta(String codigo, String nombre, CuentaContable.Tipo tipo) {
        if (cuentaRepo.findByCodigo(codigo).isPresent()) return;
        cuentaRepo.save(CuentaContable.builder().codigo(codigo).nombre(nombre).tipo(tipo).build());
    }

    private void crearAsientos() {
        if (asientoRepo.count() >= 5) return;
        CuentaContable caja = cuentaRepo.findByCodigo("1010").orElse(null);
        CuentaContable cxc = cuentaRepo.findByCodigo("1210").orElse(null);
        CuentaContable cxp = cuentaRepo.findByCodigo("2010").orElse(null);
        CuentaContable ingresos = cuentaRepo.findByCodigo("4010").orElse(null);
        CuentaContable gastoOp = cuentaRepo.findByCodigo("5010").orElse(null);
        CuentaContable gastoPer = cuentaRepo.findByCodigo("5020").orElse(null);

        crearAsientoDoble("Cobro primas Enero", LocalDate.now().minusDays(20), caja, ingresos, "8500.00");
        crearAsientoDoble("Cobro primas Febrero", LocalDate.now().minusDays(10), caja, ingresos, "9200.00");
        crearAsientoDoble("Pago alquiler oficina", LocalDate.now().minusDays(15), gastoOp, caja, "3200.00");
        crearAsientoDoble("Pago sueldos demo", LocalDate.now().minusDays(8), gastoPer, caja, "12500.00");
        crearAsientoDoble("Provision proveedor", LocalDate.now().minusDays(3), gastoOp, cxp, "1500.00");
    }

    private void crearAsientoDoble(String desc, LocalDate fecha, CuentaContable debe, CuentaContable haber, String monto) {
        if (debe == null || haber == null) return;
        BigDecimal m = new BigDecimal(monto);
        AsientoContable a = asientoRepo.save(AsientoContable.builder()
                .fecha(fecha).descripcion(desc).totalDebe(m).totalHaber(m)
                .estado(AsientoContable.Estado.CERRADO).build());
        movimientoRepo.save(MovimientoContable.builder().asiento(a).cuenta(debe).debe(m).haber(BigDecimal.ZERO).build());
        movimientoRepo.save(MovimientoContable.builder().asiento(a).cuenta(haber).debe(BigDecimal.ZERO).haber(m).build());
    }

    private void crearFacturas() {
        if (facturaRepo.count() >= 5) return;
        var clientes = clienteRepo.findAll();
        if (clientes.isEmpty()) return;
        var cli = clientes.get(0);
        crearFactura(Factura.Tipo.FACTURA, "F001", "00001", cli, "1500.00", Factura.Estado.PAGADA, 20);
        crearFactura(Factura.Tipo.FACTURA, "F001", "00002", cli, "2200.00", Factura.Estado.PAGADA, 15);
        crearFactura(Factura.Tipo.BOLETA, "B001", "00010", cli, "950.00", Factura.Estado.EMITIDA, 5);
        crearFactura(Factura.Tipo.FACTURA, "F001", "00003", cli, "3300.00", Factura.Estado.EMITIDA, 3);
        crearFactura(Factura.Tipo.NOTA_CREDITO, "NC01", "00001", cli, "500.00", Factura.Estado.EMITIDA, 1);
    }

    private void crearFactura(Factura.Tipo tipo, String serie, String numero,
                              com.serena.modules.seguridad.clientes.entity.Cliente cli,
                              String total, Factura.Estado estado, int diasAtras) {
        if (facturaRepo.findAllByOrderByFechaEmisionDesc().stream()
                .anyMatch(f -> f.getSerie().equals(serie) && f.getNumero().equals(numero))) return;
        facturaRepo.save(Factura.builder()
                .tipo(tipo).serie(serie).numero(numero).cliente(cli)
                .total(new BigDecimal(total)).fechaEmision(LocalDate.now().minusDays(diasAtras))
                .estado(estado).build());
    }

    private void procesarPlanillaMesActual() {
        String periodo = YearMonth.now().toString();
        if (planillaRepo.findByPeriodo(periodo).isPresent()) return;
        try {
            nominaService.procesar(new ProcesarPlanillaRequest(periodo));
        } catch (Exception ignored) {
            // Si no hay empleados activos, simplemente no se siembra
        }
    }
}
