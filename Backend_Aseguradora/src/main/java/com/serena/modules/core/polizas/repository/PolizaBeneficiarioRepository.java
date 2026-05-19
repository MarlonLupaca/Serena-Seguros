package com.serena.modules.core.polizas.repository;

import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.entity.PolizaBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolizaBeneficiarioRepository extends JpaRepository<PolizaBeneficiario, Integer> {

    List<PolizaBeneficiario> findByPoliza(Poliza poliza);

    void deleteByPoliza(Poliza poliza);
}
