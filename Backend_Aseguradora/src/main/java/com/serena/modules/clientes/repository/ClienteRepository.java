package com.serena.modules.clientes.repository;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.clientes.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByPersona(Persona persona);

    List<Cliente> findAllByOrderByFechaRegistroDesc();

    List<Cliente> findByEstadoCrmOrderByFechaRegistroDesc(Cliente.EstadoCrm estado);
}
