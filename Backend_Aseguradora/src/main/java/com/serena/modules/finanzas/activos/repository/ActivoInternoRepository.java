package com.serena.modules.finanzas.activos.repository;

import com.serena.modules.finanzas.activos.entity.ActivoInterno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivoInternoRepository extends JpaRepository<ActivoInterno, Integer> {
    List<ActivoInterno> findAllByOrderByIdActivoDesc();
    List<ActivoInterno> findByEstadoOrderByIdActivoDesc(ActivoInterno.Estado estado);
}
