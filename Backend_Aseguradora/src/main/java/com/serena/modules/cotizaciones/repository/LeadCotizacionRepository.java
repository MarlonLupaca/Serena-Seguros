package com.serena.modules.cotizaciones.repository;

import com.serena.modules.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.empleados.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadCotizacionRepository extends JpaRepository<LeadCotizacion, Integer> {

    List<LeadCotizacion> findAllByOrderByFechaIngresoDesc();

    List<LeadCotizacion> findByEstadoKanbanOrderByFechaIngresoDesc(LeadCotizacion.EstadoKanban estado);

    List<LeadCotizacion> findByEmpleadoAgenteOrderByFechaIngresoDesc(Empleado empleadoAgente);

    List<LeadCotizacion> findByEmpleadoAgenteAndEstadoKanbanOrderByFechaIngresoDesc(
            Empleado empleadoAgente, LeadCotizacion.EstadoKanban estado
    );
}
