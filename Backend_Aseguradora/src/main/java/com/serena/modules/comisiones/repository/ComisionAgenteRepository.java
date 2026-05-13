package com.serena.modules.comisiones.repository;

import com.serena.modules.comisiones.entity.ComisionAgente;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.polizas.entity.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComisionAgenteRepository extends JpaRepository<ComisionAgente, Integer> {

    List<ComisionAgente> findByEmpleadoAgenteOrderByIdComisionDesc(Empleado empleado);

    List<ComisionAgente> findByEmpleadoAgenteAndEstadoPagoOrderByIdComisionDesc(
            Empleado empleado, ComisionAgente.EstadoPago estado
    );

    List<ComisionAgente> findAllByOrderByIdComisionDesc();

    Optional<ComisionAgente> findByPoliza(Poliza poliza);
}
