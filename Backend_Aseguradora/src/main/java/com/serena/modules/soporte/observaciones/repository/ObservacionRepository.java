package com.serena.modules.soporte.observaciones.repository;

import com.serena.modules.soporte.observaciones.entity.Observacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObservacionRepository extends JpaRepository<Observacion, Integer> {
    List<Observacion> findByTipoReferenciaAndIdReferenciaOrderByFechaCreacionAsc(String tipoReferencia, Integer idReferencia);
}
