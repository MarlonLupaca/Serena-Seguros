package com.serena.modules.finanzas.contabilidad.repository;

import com.serena.modules.finanzas.contabilidad.entity.AsientoContable;
import com.serena.modules.finanzas.contabilidad.entity.MovimientoContable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoContableRepository extends JpaRepository<MovimientoContable, Integer> {

    List<MovimientoContable> findByAsientoOrderByIdMovimientoAsc(AsientoContable asiento);

    List<MovimientoContable> findAll();
}
