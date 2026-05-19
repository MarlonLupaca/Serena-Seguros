package com.serena.modules.tecnico.indemnizaciones.repository;

import com.serena.modules.tecnico.indemnizaciones.entity.Indemnizacion;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IndemnizacionRepository extends JpaRepository<Indemnizacion, Integer> {

    List<Indemnizacion> findBySiniestro(Siniestro siniestro);

    Optional<Indemnizacion> findFirstBySiniestroOrderByFechaAprobacionDesc(Siniestro siniestro);
}
