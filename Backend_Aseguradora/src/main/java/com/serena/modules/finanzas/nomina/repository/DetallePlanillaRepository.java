package com.serena.modules.finanzas.nomina.repository;

import com.serena.modules.finanzas.nomina.entity.DetallePlanilla;
import com.serena.modules.finanzas.nomina.entity.PlanillaMensual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePlanillaRepository extends JpaRepository<DetallePlanilla, Integer> {

    List<DetallePlanilla> findByPlanillaOrderByIdDetalleAsc(PlanillaMensual planilla);
}
