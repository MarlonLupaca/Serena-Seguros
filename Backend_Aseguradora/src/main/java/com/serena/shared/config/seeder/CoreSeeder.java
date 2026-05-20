package com.serena.shared.config.seeder;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Order(2) // Se ejecuta en segundo lugar, después de SeguridadSeeder
@RequiredArgsConstructor
public class CoreSeeder implements CommandLineRunner {

    private final ClienteRepository clienteRepository;
    private final ProductoSeguroRepository productoRepository;
    private final PolizaRepository polizaRepository;
    private final CuotaRepository cuotaRepository;

    @Override
    @Transactional
    public void run(String... args) {
        crearProductosDemo(); // Añadido para asegurar que los productos existan
        crearPolizasDemo();   // Tu lógica original de pólizas
        crearCuotasDemo();    // Tu lógica original de cuotas
    }

    private void crearProductosDemo() {
        if (productoRepository.count() == 0) {
            crearProducto("Auto Total Plus", ProductoSeguro.TipoSeguro.VEHICULAR, "1200.00", "Cobertura todo riesgo para autos particulares");
            crearProducto("Auto Basico", ProductoSeguro.TipoSeguro.VEHICULAR, "650.00", "Cobertura contra robo y accidentes");
            crearProducto("Todo Riesgo Camioneta", ProductoSeguro.TipoSeguro.VEHICULAR, "1500.00", "Cobertura integral para camionetas y SUV");
            crearProducto("Auto Joven", ProductoSeguro.TipoSeguro.VEHICULAR, "800.00", "Plan especial para conductores de 18 a 25 anos");
            crearProducto("Auto Premium", ProductoSeguro.TipoSeguro.VEHICULAR, "2200.00", "Cobertura premium con auto sustituto y grua VIP");

            crearProducto("SOAT Digital", ProductoSeguro.TipoSeguro.SOAT, "47.00", "SOAT electronico para autos particulares");
            crearProducto("SOAT Moto", ProductoSeguro.TipoSeguro.SOAT, "35.00", "SOAT para motocicletas y cuatrimotos");
            crearProducto("SOAT Taxi", ProductoSeguro.TipoSeguro.SOAT, "85.00", "SOAT para vehiculos de servicio publico");
            crearProducto("SOAT Carga Pesada", ProductoSeguro.TipoSeguro.SOAT, "120.00", "SOAT para camiones y vehiculos de carga");
            crearProducto("SOAT Express", ProductoSeguro.TipoSeguro.SOAT, "52.00", "SOAT con emision inmediata en 3 minutos");

            crearProducto("Vida Inversion", ProductoSeguro.TipoSeguro.VIDA, "900.00", "Seguro de vida con componente de ahorro");
            crearProducto("Vida Familiar", ProductoSeguro.TipoSeguro.VIDA, "1200.00", "Proteccion integral para toda la familia");
            crearProducto("Vida Temporal", ProductoSeguro.TipoSeguro.VIDA, "350.00", "Cobertura por periodo definido a bajo costo");
            crearProducto("Vida Universal", ProductoSeguro.TipoSeguro.VIDA, "1500.00", "Seguro flexible con valor en efectivo acumulable");
            crearProducto("Vida Ahorro Educativo", ProductoSeguro.TipoSeguro.VIDA, "600.00", "Ahorro programado para la educacion de tus hijos");

            crearProducto("Salud Premium", ProductoSeguro.TipoSeguro.SALUD, "1800.00", "Red de clinicas premium con copagos minimos");
            crearProducto("EPS Basica", ProductoSeguro.TipoSeguro.SALUD, "450.00", "Plan basico de salud con cobertura esencial");
            crearProducto("Salud Familiar", ProductoSeguro.TipoSeguro.SALUD, "2400.00", "Cobertura para toda la familia con maternidad");
            crearProducto("Oncologico", ProductoSeguro.TipoSeguro.SALUD, "800.00", "Cobertura especializada contra el cancer");
            crearProducto("Dental Plus", ProductoSeguro.TipoSeguro.SALUD, "250.00", "Plan dental con ortodoncia y estetica");

            crearProducto("Viajero Global", ProductoSeguro.TipoSeguro.VIAJE, "150.00", "Cobertura internacional con asistencia medica ilimitada");
            crearProducto("Viajero Nacional", ProductoSeguro.TipoSeguro.VIAJE, "45.00", "Asistencia en viajes dentro del pais");
            crearProducto("Viajero Estudiantil", ProductoSeguro.TipoSeguro.VIAJE, "200.00", "Plan para estudiantes en el extranjero");
            crearProducto("Viajero Business", ProductoSeguro.TipoSeguro.VIAJE, "320.00", "Cobertura premium para viajes de negocios");
            crearProducto("Viajero Aventura", ProductoSeguro.TipoSeguro.VIAJE, "280.00", "Incluye deportes extremos y actividades de riesgo");

            crearProducto("Hogar Seguro", ProductoSeguro.TipoSeguro.HOGAR, "450.00", "Proteccion contra robo, incendio y desastres naturales");
            crearProducto("Hogar Premium", ProductoSeguro.TipoSeguro.HOGAR, "850.00", "Cobertura total con asistencia domiciliaria 24/7");
            crearProducto("Multiriesgo Hogar", ProductoSeguro.TipoSeguro.HOGAR, "600.00", "Proteccion ampliada para contenido y estructura");
            crearProducto("Contenido Hogar", ProductoSeguro.TipoSeguro.HOGAR, "300.00", "Cobertura exclusiva para bienes dentro del hogar");
            crearProducto("Sismo Plus", ProductoSeguro.TipoSeguro.HOGAR, "380.00", "Proteccion especializada contra terremotos");

            crearProducto("Empresarial Integral", ProductoSeguro.TipoSeguro.EMPRESA, "3500.00", "Paquete completo para medianas y grandes empresas");
            crearProducto("SCTR", ProductoSeguro.TipoSeguro.EMPRESA, "1200.00", "Seguro complementario de trabajo de riesgo");
            crearProducto("Responsabilidad Civil", ProductoSeguro.TipoSeguro.EMPRESA, "2000.00", "Proteccion ante reclamos de terceros");
            crearProducto("Multiriesgo Negocio", ProductoSeguro.TipoSeguro.EMPRESA, "1800.00", "Cobertura para locales comerciales y oficinas");
            crearProducto("Carga y Transporte", ProductoSeguro.TipoSeguro.EMPRESA, "950.00", "Proteccion de mercancias en transito");

            crearProducto("Mascota Basico", ProductoSeguro.TipoSeguro.MASCOTAS, "80.00", "Consultas veterinarias y vacunas esenciales");
            crearProducto("Mascota Premium", ProductoSeguro.TipoSeguro.MASCOTAS, "180.00", "Cobertura completa con cirugia y hospitalizacion");
            crearProducto("Mascota Cachorro", ProductoSeguro.TipoSeguro.MASCOTAS, "120.00", "Plan especial para cachorros hasta 2 anos");
            crearProducto("Mascota Senior", ProductoSeguro.TipoSeguro.MASCOTAS, "200.00", "Cobertura para mascotas mayores de 8 anos");
            crearProducto("Mascota Total", ProductoSeguro.TipoSeguro.MASCOTAS, "250.00", "Todo incluido: consultas, cirugia, dental y nutricion");
        }
    }

    private void crearProducto(String nombre, ProductoSeguro.TipoSeguro tipo, String prima, String cobertura) {
        productoRepository.save(ProductoSeguro.builder()
                .nombre(nombre)
                .tipoSeguro(tipo)
                .primaBase(new BigDecimal(prima))
                .limitesCobertura(cobertura)
                .estado(ProductoSeguro.Estado.ACTIVO)
                .build());
    }

    private void crearPolizasDemo() {
        clienteRepository.findAll().forEach(cliente -> {
            if (!polizaRepository.findByClienteOrderByFechaEmisionDesc(cliente).isEmpty()) return;

            // Crea póliza para el producto 1 (Auto Total Plus)
            crearPolizaDemo(cliente, 1, new BigDecimal("1500.00"),
                    Poliza.EstadoPoliza.ACTIVA,
                    LocalDate.now().minusMonths(2),
                    LocalDate.now().plusMonths(10));

            // Crea póliza para el producto 4 (Hogar Seguro)
            crearPolizaDemo(cliente, 4, new BigDecimal("3600.00"),
                    Poliza.EstadoPoliza.ACTIVA,
                    LocalDate.now().minusMonths(1),
                    LocalDate.now().plusMonths(11));

            // Crea póliza para el producto 5 (Viajero Global)
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
}