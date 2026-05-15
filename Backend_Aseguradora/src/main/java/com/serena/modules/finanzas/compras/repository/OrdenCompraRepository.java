package com.serena.modules.finanzas.compras.repository;

import com.serena.modules.finanzas.compras.entity.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Integer> {

    List<OrdenCompra> findAllByOrderByFechaEmisionDesc();
}
