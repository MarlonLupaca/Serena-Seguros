package com.serena.modules.seguridad.clientes.service;

import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.core.polizas.dto.PolizaResponse;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.finanzas.cuotas.dto.CuotaResponse;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.dto.CambioEstadoCrmRequest;
import com.serena.modules.seguridad.clientes.dto.ClienteResponse;
import com.serena.modules.seguridad.clientes.dto.ClienteResumenResponse;
import com.serena.modules.seguridad.clientes.dto.CrearNotaRequest;
import com.serena.modules.seguridad.clientes.dto.NotaClienteResponse;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.entity.NotaCliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.clientes.repository.NotaClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.tecnico.siniestros.dto.SiniestroAdminResponse;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final NotaClienteRepository notaRepository;
    private final PolizaRepository polizaRepository;
    private final CuotaRepository cuotaRepository;
    private final SiniestroRepository siniestroRepository;
    private final LeadCotizacionRepository leadRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;

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

    @Transactional(readOnly = true)
    public ClienteResumenResponse resumen(Integer id) {
        Cliente cliente = buscar(id);

        List<PolizaResponse> polizas = polizaRepository
                .findByClienteOrderByFechaEmisionDesc(cliente)
                .stream()
                .map(PolizaResponse::from)
                .toList();

        List<CuotaResponse> cuotas = cuotaRepository
                .findByPolizaClienteOrderByFechaVencimientoAsc(cliente)
                .stream()
                .map(CuotaResponse::from)
                .toList();

        List<SiniestroAdminResponse> siniestros = siniestroRepository
                .findByPolizaClienteOrderByFechaReporteDesc(cliente)
                .stream()
                .map(SiniestroAdminResponse::from)
                .toList();

        List<CotizacionResponse> leads = leadRepository.findAllByOrderByFechaIngresoDesc()
                .stream()
                .filter(l -> {
                    var emp = l.getEmpleadoAgente();
                    return emp != null
                            && emp.getPersona() != null
                            && emp.getPersona().getIdPersona().equals(cliente.getPersona().getIdPersona());
                })
                .map(CotizacionResponse::from)
                .toList();

        List<NotaClienteResponse> notas = notaRepository
                .findByClienteOrderByFechaDesc(cliente)
                .stream()
                .map(NotaClienteResponse::from)
                .toList();

        return new ClienteResumenResponse(ClienteResponse.from(cliente), polizas, cuotas, siniestros, leads, notas);
    }

    @Transactional(readOnly = true)
    public List<NotaClienteResponse> listarNotas(Integer id) {
        Cliente cliente = buscar(id);
        return notaRepository.findByClienteOrderByFechaDesc(cliente)
                .stream()
                .map(NotaClienteResponse::from)
                .toList();
    }

    @Transactional
    public NotaClienteResponse crearNota(Integer id, CrearNotaRequest request, Usuario usuario) {
        Cliente cliente = buscar(id);
        Empleado autor = usuario != null
                ? personaRepository.findByUsuario(usuario)
                        .flatMap(empleadoRepository::findByPersona)
                        .orElse(null)
                : null;
        NotaCliente nota = NotaCliente.builder()
                .cliente(cliente)
                .empleadoAutor(autor)
                .texto(request.texto())
                .build();
        return NotaClienteResponse.from(notaRepository.save(nota));
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
