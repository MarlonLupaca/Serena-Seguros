package com.serena.modules.siniestros.repository;

import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.siniestros.entity.Siniestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiniestroRepository extends JpaRepository<Siniestro, Integer> {

    List<Siniestro> findByPolizaClienteOrderByFechaReporteDesc(Cliente cliente);

    List<Siniestro> findAllByOrderByFechaReporteDesc();

    List<Siniestro> findByEstadoResolucionOrderByFechaReporteDesc(Siniestro.EstadoResolucion estado);

    List<Siniestro> findByEmpleadoAnalistaOrderByFechaReporteDesc(Empleado empleadoAnalista);
}
