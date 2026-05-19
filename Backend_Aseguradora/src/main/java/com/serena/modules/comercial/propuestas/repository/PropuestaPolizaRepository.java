package com.serena.modules.comercial.propuestas.repository;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropuestaPolizaRepository extends JpaRepository<PropuestaPoliza, Integer> {

    List<PropuestaPoliza> findByCotizacionOrderByFechaEmisionDesc(LeadCotizacion cotizacion);

    Optional<PropuestaPoliza> findFirstByCotizacionOrderByFechaEmisionDesc(LeadCotizacion cotizacion);
}
