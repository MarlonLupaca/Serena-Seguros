package com.serena.modules.ejecutivo.repository;

import com.serena.modules.ejecutivo.entity.ObjetivoCorporativo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjetivoCorporativoRepository extends JpaRepository<ObjetivoCorporativo, Integer> {

    List<ObjetivoCorporativo> findAllByOrderByIdObjetivoDesc();

    List<ObjetivoCorporativo> findByEstadoOrderByIdObjetivoDesc(ObjetivoCorporativo.Estado estado);
}
