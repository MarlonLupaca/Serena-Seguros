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

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.modulo FROM AuditoriaAccion a WHERE a.modulo IS NOT NULL")
    List<String> findDistinctModulos();

    List<AuditoriaAccion> findByModuloAndDetalleStartingWithOrderByFechaAsc(String modulo, String prefijo);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM AuditoriaAccion a " +
            "WHERE (:modulo IS NULL OR :modulo = '' OR a.modulo = :modulo) " +
            "AND (:username IS NULL OR :username = '' OR LOWER(a.username) LIKE LOWER(CONCAT('%', :username, '%'))) " +
            "ORDER BY a.fecha DESC")
    List<AuditoriaAccion> buscarConFiltros(@org.springframework.data.repository.query.Param("modulo") String modulo,
                                           @org.springframework.data.repository.query.Param("username") String username,
                                           Pageable pageable);
}
