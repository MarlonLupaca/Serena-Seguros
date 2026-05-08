package com.serena.modules.polizas.repository;

import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.polizas.entity.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PolizaRepository extends JpaRepository<Poliza, Integer> {

    List<Poliza> findByClienteOrderByFechaEmisionDesc(Cliente cliente);

    List<Poliza> findByClienteAndEstadoPolizaOrderByFechaEmisionDesc(
            Cliente cliente,
            Poliza.EstadoPoliza estado
    );

    List<Poliza> findAllByOrderByFechaEmisionDesc();

    List<Poliza> findByEstadoPolizaOrderByFechaEmisionDesc(Poliza.EstadoPoliza estado);

    List<Poliza> findByVigenciaFinBetweenAndEstadoPolizaOrderByVigenciaFinAsc(
            LocalDate desde, LocalDate hasta, Poliza.EstadoPoliza estado
    );
}
