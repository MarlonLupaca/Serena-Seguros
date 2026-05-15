package com.serena.modules.seguridad.clientes.repository;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.entity.NotaCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaClienteRepository extends JpaRepository<NotaCliente, Integer> {

    List<NotaCliente> findByClienteOrderByFechaDesc(Cliente cliente);
}
