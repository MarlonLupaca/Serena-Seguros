package com.serena.modules.finanzas.contabilidad.repository;

import com.serena.modules.finanzas.contabilidad.entity.AsientoContable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsientoContableRepository extends JpaRepository<AsientoContable, Integer> {

    List<AsientoContable> findAllByOrderByFechaDesc();
}
