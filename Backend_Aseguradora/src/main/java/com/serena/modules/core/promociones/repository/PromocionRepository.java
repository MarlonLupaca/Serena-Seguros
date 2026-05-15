package com.serena.modules.core.promociones.repository;

import com.serena.modules.core.promociones.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Integer> {

    @Query("SELECT p FROM Promocion p WHERE p.activa = true AND :hoy BETWEEN p.fechaInicio AND p.fechaFin ORDER BY p.descuentoPct DESC")
    List<Promocion> findActivasVigentes(@Param("hoy") LocalDate hoy);
}
