package com.serena.modules.finanzas.cuotas.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.finanzas.cuotas.dto.CuotaResponse;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuotaService {

    private final CuotaRepository cuotaRepository;
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public List<CuotaResponse> misCuotas(Usuario usuario, Cuota.EstadoPago estado) {
        Cliente cliente = clienteDelUsuario(usuario);
        List<Cuota> cuotas = (estado != null)
                ? cuotaRepository.findByPolizaClienteAndEstadoPagoOrderByFechaVencimientoAsc(cliente, estado)
                : cuotaRepository.findByPolizaClienteOrderByFechaVencimientoAsc(cliente);
        return cuotas.stream().map(CuotaResponse::from).toList();
    }

    @Transactional
    public CuotaResponse pagar(Usuario usuario, Integer idCuota) {
        Cliente cliente = clienteDelUsuario(usuario);
        Cuota cuota = cuotaRepository.findById(idCuota)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cuota", idCuota));
        if (!cuota.getPoliza().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La cuota no pertenece al usuario");
        }
        if (cuota.getEstadoPago() == Cuota.EstadoPago.PAGADO) {
            return CuotaResponse.from(cuota);
        }
        cuota.setEstadoPago(Cuota.EstadoPago.PAGADO);
        return CuotaResponse.from(cuotaRepository.save(cuota));
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }
}
