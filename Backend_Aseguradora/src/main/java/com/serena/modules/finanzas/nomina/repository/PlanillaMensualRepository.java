package com.serena.modules.finanzas.nomina.repository;

import com.serena.modules.finanzas.nomina.entity.PlanillaMensual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanillaMensualRepository extends JpaRepository<PlanillaMensual, Integer> {

    List<PlanillaMensual> findAllByOrderByPeriodoDesc();

    Optional<PlanillaMensual> findByPeriodo(String periodo);
}
