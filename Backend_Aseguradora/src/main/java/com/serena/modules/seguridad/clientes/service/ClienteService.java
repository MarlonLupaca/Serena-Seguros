package com.serena.modules.seguridad.clientes.service;

import com.serena.modules.seguridad.clientes.dto.CambioEstadoCrmRequest;
import com.serena.modules.seguridad.clientes.dto.ClienteResponse;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteResponse> listar(Cliente.EstadoCrm estado) {
        List<Cliente> clientes = (estado != null)
                ? clienteRepository.findByEstadoCrmOrderByFechaRegistroDesc(estado)
                : clienteRepository.findAllByOrderByFechaRegistroDesc();
        return clientes.stream().map(ClienteResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse obtener(Integer id) {
        return ClienteResponse.from(buscar(id));
    }

    @Transactional
    public ClienteResponse cambiarEstadoCrm(Integer id, CambioEstadoCrmRequest request) {
        Cliente cliente = buscar(id);
        cliente.setEstadoCrm(request.estadoCrm());
        return ClienteResponse.from(clienteRepository.save(cliente));
    }

    private Cliente buscar(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", id));
    }
}
