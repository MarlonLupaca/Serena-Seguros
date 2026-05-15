package com.serena.modules.finanzas.compras.repository;

import com.serena.modules.finanzas.compras.entity.SolicitudCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudCompraRepository extends JpaRepository<SolicitudCompra, Integer> {

    List<SolicitudCompra> findAllByOrderByFechaSolicitudDesc();

    List<SolicitudCompra> findByEstadoOrderByFechaSolicitudDesc(SolicitudCompra.Estado estado);
}
