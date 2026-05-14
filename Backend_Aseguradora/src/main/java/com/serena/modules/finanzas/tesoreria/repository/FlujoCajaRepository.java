package com.serena.modules.finanzas.tesoreria.repository;

import com.serena.modules.finanzas.tesoreria.entity.FlujoCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlujoCajaRepository extends JpaRepository<FlujoCaja, Integer> {
    List<FlujoCaja> findAllByOrderByFechaProgramadaDesc();
    List<FlujoCaja> findByEstadoAprobacionOrderByFechaProgramadaDesc(FlujoCaja.EstadoAprobacion estado);
}
