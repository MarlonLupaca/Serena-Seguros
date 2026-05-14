package com.serena.modules.comercial.campanas.repository;

import com.serena.modules.comercial.campanas.entity.CampanaMarketing;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampanaMarketingRepository extends JpaRepository<CampanaMarketing, Integer> {

    List<CampanaMarketing> findByEmpleadoAgenteOrderByFechaCreacionDesc(Empleado empleado);

    List<CampanaMarketing> findAllByOrderByFechaCreacionDesc();
}
