package com.serena.modules.comercial.cotizaciones.repository;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadCotizacionRepository extends JpaRepository<LeadCotizacion, Integer> {

    List<LeadCotizacion> findAllByOrderByFechaIngresoDesc();

    List<LeadCotizacion> findByClienteOrderByFechaIngresoDesc(Cliente cliente);

    List<LeadCotizacion> findByEstadoKanbanOrderByFechaIngresoDesc(LeadCotizacion.EstadoKanban estado);

    List<LeadCotizacion> findByEmpleadoAgenteOrderByFechaIngresoDesc(Empleado empleadoAgente);

    List<LeadCotizacion> findByEmpleadoAgenteAndEstadoKanbanOrderByFechaIngresoDesc(
            Empleado empleadoAgente, LeadCotizacion.EstadoKanban estado
    );
}
