package com.serena.modules.empleados.repository;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.empleados.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {

    Optional<Empleado> findByPersona(Persona persona);
}
