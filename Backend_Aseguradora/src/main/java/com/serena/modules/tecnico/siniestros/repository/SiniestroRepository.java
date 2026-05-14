package com.serena.modules.tecnico.siniestros.repository;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
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
