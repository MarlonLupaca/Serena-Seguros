package com.serena.modules.cuotas.repository;

import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.cuotas.entity.Cuota;
import com.serena.modules.polizas.entity.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuotaRepository extends JpaRepository<Cuota, Integer> {

    List<Cuota> findByPolizaOrderByNumeroCuotaAsc(Poliza poliza);

    List<Cuota> findByPolizaClienteOrderByFechaVencimientoAsc(Cliente cliente);

    List<Cuota> findByPolizaClienteAndEstadoPagoOrderByFechaVencimientoAsc(
            Cliente cliente,
            Cuota.EstadoPago estado
    );

    List<Cuota> findAllByOrderByFechaVencimientoAsc();

    List<Cuota> findByEstadoPagoOrderByFechaVencimientoAsc(Cuota.EstadoPago estado);
}
