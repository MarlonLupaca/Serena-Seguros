package com.serena.modules.ejecutivo.riesgos.repository;

import com.serena.modules.ejecutivo.riesgos.entity.RiesgoCorporativo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiesgoRepository extends JpaRepository<RiesgoCorporativo, Integer> {

    List<RiesgoCorporativo> findAllByOrderByFechaRegistroDesc();
}
