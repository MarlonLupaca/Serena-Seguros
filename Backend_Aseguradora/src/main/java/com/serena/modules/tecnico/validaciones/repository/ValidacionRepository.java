package com.serena.modules.tecnico.validaciones.repository;

import com.serena.modules.tecnico.validaciones.entity.ValidacionDocumental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValidacionRepository extends JpaRepository<ValidacionDocumental, Integer> {

    List<ValidacionDocumental> findAllByOrderByFechaIngresoDesc();

    List<ValidacionDocumental> findByEstadoOrderByFechaIngresoDesc(ValidacionDocumental.Estado estado);
}
