package com.serena.modules.soporte.auditoria.repository;

import com.serena.modules.soporte.auditoria.entity.AuditoriaAccion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<AuditoriaAccion, Integer> {

    List<AuditoriaAccion> findAllByOrderByFechaDesc(Pageable pageable);

    List<AuditoriaAccion> findByModuloOrderByFechaDesc(String modulo, Pageable pageable);

    List<AuditoriaAccion> findByUsernameOrderByFechaDesc(String username, Pageable pageable);

    List<AuditoriaAccion> findByModuloAndDetalleStartingWithOrderByFechaAsc(String modulo, String prefijo);
}
