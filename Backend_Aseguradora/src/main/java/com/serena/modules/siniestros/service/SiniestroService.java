package com.serena.modules.siniestros.service;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.clientes.repository.ClienteRepository;
import com.serena.modules.polizas.entity.Poliza;
import com.serena.modules.polizas.repository.PolizaRepository;
import com.serena.modules.siniestros.dto.CrearSiniestroRequest;
import com.serena.modules.siniestros.dto.SiniestroResponse;
import com.serena.modules.siniestros.entity.Siniestro;
import com.serena.modules.siniestros.repository.SiniestroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiniestroService {

    private final SiniestroRepository siniestroRepository;
    private final PolizaRepository polizaRepository;
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public List<SiniestroResponse> misSiniestros(Usuario usuario) {
        Cliente cliente = clienteDelUsuario(usuario);
        return siniestroRepository
                .findByPolizaClienteOrderByFechaReporteDesc(cliente)
                .stream()
                .map(SiniestroResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SiniestroResponse miSiniestro(Usuario usuario, Integer idSiniestro) {
        Cliente cliente = clienteDelUsuario(usuario);
        Siniestro siniestro = siniestroRepository.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        if (!siniestro.getPoliza().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("El siniestro no pertenece al usuario");
        }
        return SiniestroResponse.from(siniestro);
    }

    @Transactional
    public SiniestroResponse reportar(Usuario usuario, CrearSiniestroRequest request) {
        Cliente cliente = clienteDelUsuario(usuario);
        Poliza poliza = polizaRepository.findById(request.idPoliza())
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", request.idPoliza()));
        if (!poliza.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La poliza no pertenece al usuario");
        }
        Siniestro siniestro = Siniestro.builder()
                .poliza(poliza)
                .tipoIncidente(request.tipoIncidente())
                .descripcion(request.descripcion())
                .fechaOcurrencia(request.fechaOcurrencia())
                .montoReclamado(request.montoReclamado())
                .estadoResolucion(Siniestro.EstadoResolucion.REPORTADO)
                .build();
        return SiniestroResponse.from(siniestroRepository.save(siniestro));
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }
}
