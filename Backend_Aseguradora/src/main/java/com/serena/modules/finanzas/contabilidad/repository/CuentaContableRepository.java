package com.serena.modules.finanzas.contabilidad.repository;

import com.serena.modules.finanzas.contabilidad.entity.CuentaContable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaContableRepository extends JpaRepository<CuentaContable, Integer> {

    List<CuentaContable> findAllByOrderByCodigoAsc();

    Optional<CuentaContable> findByCodigo(String codigo);

    List<CuentaContable> findByTipoOrderByCodigoAsc(CuentaContable.Tipo tipo);
}
