package com.serena.modules.ejecutivo.repository;

import com.serena.modules.ejecutivo.entity.AprobacionCritica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AprobacionCriticaRepository extends JpaRepository<AprobacionCritica, Integer> {

    List<AprobacionCritica> findAllByOrderByFechaSolicitudDesc();

    List<AprobacionCritica> findByEstadoGerencialOrderByFechaSolicitudDesc(AprobacionCritica.EstadoGerencial estado);

    long countByEstadoGerencial(AprobacionCritica.EstadoGerencial estado);
}
