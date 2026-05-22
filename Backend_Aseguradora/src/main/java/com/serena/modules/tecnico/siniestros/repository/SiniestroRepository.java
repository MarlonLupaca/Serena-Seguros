package com.serena.modules.tecnico.siniestros.repository;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiniestroRepository extends JpaRepository<Siniestro, Integer> {

    List<Siniestro> findByPolizaClienteOrderByFechaReporteDesc(Cliente cliente);

    List<Siniestro> findAllByOrderByFechaReporteDesc();

    List<Siniestro> findByEstadoResolucionOrderByFechaReporteDesc(Siniestro.EstadoResolucion estado);

    List<Siniestro> findByEmpleadoAnalistaOrderByFechaReporteDesc(Empleado empleadoAnalista);

    @Query("SELECT DISTINCT s FROM Siniestro s "
            + "JOIN s.poliza p JOIN p.cliente c "
            + "JOIN LeadCotizacion l ON l.cliente = c "
            + "WHERE l.empleadoAgente = :agente "
            + "ORDER BY s.fechaReporte DESC")
    List<Siniestro> findByAgenteComercial(@Param("agente") Empleado agente);
}
