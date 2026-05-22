package com.serena.modules.comercial.suscripcion.repository;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluacionRiesgoRepository extends JpaRepository<EvaluacionRiesgo, Integer> {

    Optional<EvaluacionRiesgo> findByCotizacion(LeadCotizacion cotizacion);

    List<EvaluacionRiesgo> findAllByOrderByFechaEvaluacionDesc();

    List<EvaluacionRiesgo> findByEstadoSuscripcionOrderByFechaEvaluacionDesc(
            EvaluacionRiesgo.EstadoSuscripcion estadoSuscripcion);
}
