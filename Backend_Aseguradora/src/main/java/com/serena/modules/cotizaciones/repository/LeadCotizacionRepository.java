package com.serena.modules.cotizaciones.repository;

import com.serena.modules.cotizaciones.entity.LeadCotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadCotizacionRepository extends JpaRepository<LeadCotizacion, Integer> {
}
