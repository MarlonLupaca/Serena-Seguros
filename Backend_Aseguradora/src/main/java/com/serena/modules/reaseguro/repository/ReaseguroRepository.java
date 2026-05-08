package com.serena.modules.reaseguro.repository;

import com.serena.modules.reaseguro.entity.Reaseguro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReaseguroRepository extends JpaRepository<Reaseguro, Integer> {

    List<Reaseguro> findAllByOrderByIdReaseguroDesc();
}
