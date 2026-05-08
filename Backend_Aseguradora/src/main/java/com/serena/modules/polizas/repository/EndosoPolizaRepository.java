package com.serena.modules.polizas.repository;

import com.serena.modules.polizas.entity.EndosoPoliza;
import com.serena.modules.polizas.entity.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EndosoPolizaRepository
        extends JpaRepository<EndosoPoliza, Integer> {

    List<EndosoPoliza> findByPolizaOrderByFechaSolicitudDesc(Poliza poliza);
}
