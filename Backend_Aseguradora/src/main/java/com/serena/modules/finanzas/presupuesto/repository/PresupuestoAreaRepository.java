package com.serena.modules.finanzas.presupuesto.repository;

import com.serena.modules.finanzas.presupuesto.entity.PresupuestoArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoAreaRepository extends JpaRepository<PresupuestoArea, Integer> {

    List<PresupuestoArea> findAllByOrderByAreaAsc();
}
