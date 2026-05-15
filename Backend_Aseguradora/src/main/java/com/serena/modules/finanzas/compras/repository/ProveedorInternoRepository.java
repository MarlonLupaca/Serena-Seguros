package com.serena.modules.finanzas.compras.repository;

import com.serena.modules.finanzas.compras.entity.ProveedorInterno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorInternoRepository extends JpaRepository<ProveedorInterno, Integer> {

    List<ProveedorInterno> findAllByOrderByNombreAsc();

    List<ProveedorInterno> findByEstadoOrderByNombreAsc(ProveedorInterno.Estado estado);
}
