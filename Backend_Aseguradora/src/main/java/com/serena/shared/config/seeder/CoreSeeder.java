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
            productoRepository.save(ProductoSeguro.builder()
                    .nombre("Auto Total Plus")
                    .tipoSeguro(ProductoSeguro.TipoSeguro.VEHICULAR) // Asegúrate de que el Enum coincida con tu entidad
                    .primaBase(new BigDecimal("1200.00"))
                    .estado(ProductoSeguro.Estado.ACTIVO)
                    .build());

            productoRepository.save(ProductoSeguro.builder()
                    .nombre("Salud Premium")
                    .tipoSeguro(ProductoSeguro.TipoSeguro.SALUD)
                    .primaBase(new BigDecimal("1800.00"))
                    .estado(ProductoSeguro.Estado.ACTIVO)
                    .build());

            productoRepository.save(ProductoSeguro.builder()
                    .nombre("Vida Inversión")
                    .tipoSeguro(ProductoSeguro.TipoSeguro.VIDA)
                    .primaBase(new BigDecimal("900.00"))
                    .estado(ProductoSeguro.Estado.ACTIVO)
                    .build());

            productoRepository.save(ProductoSeguro.builder()
                    .nombre("Hogar Seguro")
                    .tipoSeguro(ProductoSeguro.TipoSeguro.HOGAR)
                    .primaBase(new BigDecimal("450.00"))
                    .estado(ProductoSeguro.Estado.ACTIVO)
                    .build());

            productoRepository.save(ProductoSeguro.builder()
                    .nombre("Viajero Global")
                    .tipoSeguro(ProductoSeguro.TipoSeguro.VIAJE)
                    .primaBase(new BigDecimal("150.00"))
                    .estado(ProductoSeguro.Estado.ACTIVO)
                    .build());
        }
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