package com.serena.modules.siniestros.repository;

import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.siniestros.entity.Siniestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiniestroRepository extends JpaRepository<Siniestro, Integer> {

    List<Siniestro> findByPolizaClienteOrderByFechaReporteDesc(Cliente cliente);
}
