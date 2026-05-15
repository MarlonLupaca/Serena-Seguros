package com.serena.modules.finanzas.contabilidad.repository;

import com.serena.modules.finanzas.contabilidad.entity.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {

    List<Factura> findAllByOrderByFechaEmisionDesc();
}
