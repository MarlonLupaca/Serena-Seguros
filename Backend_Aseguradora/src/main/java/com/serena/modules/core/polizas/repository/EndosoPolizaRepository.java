package com.serena.modules.core.polizas.repository;

import com.serena.modules.core.polizas.entity.EndosoPoliza;
import com.serena.modules.core.polizas.entity.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EndosoPolizaRepository
        extends JpaRepository<EndosoPoliza, Integer> {

    List<EndosoPoliza> findByPolizaOrderByFechaSolicitudDesc(Poliza poliza);

    List<EndosoPoliza> findAllByOrderByFechaSolicitudDesc();

    List<EndosoPoliza> findByEstadoAprobacionOrderByFechaSolicitudDesc(EndosoPoliza.EstadoAprobacion estado);

    List<EndosoPoliza> findByPoliza_ClienteOrderByFechaSolicitudDesc(com.serena.modules.seguridad.clientes.entity.Cliente cliente);
}
