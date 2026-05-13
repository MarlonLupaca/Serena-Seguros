package com.serena.modules.polizas.service;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.clientes.entity.Cliente;
import com.serena.modules.clientes.repository.ClienteRepository;
import com.serena.modules.polizas.dto.CambioEstadoPolizaRequest;
import com.serena.modules.polizas.dto.CrearEndosoRequest;
import com.serena.modules.polizas.dto.EmitirPolizaRequest;
import com.serena.modules.polizas.dto.EndosoResponse;
import com.serena.modules.polizas.dto.PolizaDetalleResponse;
import com.serena.modules.polizas.dto.PolizaResponse;
import com.serena.modules.polizas.dto.ProductoMini;
import com.serena.modules.polizas.entity.EndosoPoliza;
import com.serena.modules.polizas.entity.Poliza;
import com.serena.modules.polizas.repository.EndosoPolizaRepository;
import com.serena.modules.polizas.repository.PolizaRepository;
import com.serena.modules.productos.entity.ProductoSeguro;
import com.serena.modules.productos.repository.ProductoSeguroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PolizaService {

    private final PolizaRepository polizaRepository;
    private final EndosoPolizaRepository endosoRepository;
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;
    private final ProductoSeguroRepository productoRepository;

    @Transactional(readOnly = true)
    public List<PolizaResponse> misPolizas(Usuario usuario, Poliza.EstadoPoliza estado) {
        Cliente cliente = clienteDelUsuario(usuario);
        List<Poliza> polizas = (estado != null)
                ? polizaRepository.findByClienteAndEstadoPolizaOrderByFechaEmisionDesc(cliente, estado)
                : polizaRepository.findByClienteOrderByFechaEmisionDesc(cliente);
        return polizas.stream().map(PolizaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PolizaDetalleResponse miPolizaDetalle(Usuario usuario, Integer idPoliza) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        return aDetalle(poliza);
    }

    @Transactional
    public EndosoResponse solicitarEndoso(Usuario usuario, Integer idPoliza, CrearEndosoRequest request) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        EndosoPoliza endoso = EndosoPoliza.builder()
                .poliza(poliza)
                .tipoCambio(request.tipoCambio())
                .descripcionCambio(request.descripcionCambio())
                .estadoAprobacion(EndosoPoliza.EstadoAprobacion.PENDIENTE)
                .build();
        return EndosoResponse.from(endosoRepository.save(endoso));
    }

    @Transactional(readOnly = true)
    public List<PolizaResponse> listarTodas(Poliza.EstadoPoliza estado) {
        List<Poliza> polizas = (estado != null)
                ? polizaRepository.findByEstadoPolizaOrderByFechaEmisionDesc(estado)
                : polizaRepository.findAllByOrderByFechaEmisionDesc();
        return polizas.stream().map(PolizaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PolizaDetalleResponse detalleAdmin(Integer idPoliza) {
        Poliza poliza = polizaRepository.findById(idPoliza)
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", idPoliza));
        return aDetalle(poliza);
    }

    @Transactional
    public PolizaResponse emitir(EmitirPolizaRequest request) {
        Cliente cliente = clienteRepository.findById(request.idCliente())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", request.idCliente()));
        ProductoSeguro producto = productoRepository.findById(request.idProducto())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", request.idProducto()));
        Poliza poliza = Poliza.builder()
                .cliente(cliente)
                .producto(producto)
                .primaTotal(request.primaTotal())
                .estadoPoliza(Poliza.EstadoPoliza.ACTIVA)
                .vigenciaInicio(request.vigenciaInicio())
                .vigenciaFin(request.vigenciaFin())
                .build();
        return PolizaResponse.from(polizaRepository.save(poliza));
    }

    @Transactional
    public PolizaResponse cambiarEstado(Integer id, CambioEstadoPolizaRequest request) {
        Poliza poliza = polizaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", id));
        poliza.setEstadoPoliza(request.estadoPoliza());
        return PolizaResponse.from(polizaRepository.save(poliza));
    }

    @Transactional(readOnly = true)
    public List<PolizaResponse> renovaciones(int diasAdelante) {
        LocalDate hoy = LocalDate.now();
        LocalDate hasta = hoy.plusDays(diasAdelante);
        return polizaRepository.findByVigenciaFinBetweenAndEstadoPolizaOrderByVigenciaFinAsc(
                hoy, hasta, Poliza.EstadoPoliza.ACTIVA
        ).stream().map(PolizaResponse::from).toList();
    }

    private PolizaDetalleResponse aDetalle(Poliza poliza) {
        List<EndosoResponse> endosos = endosoRepository
                .findByPolizaOrderByFechaSolicitudDesc(poliza)
                .stream().map(EndosoResponse::from).toList();
        return new PolizaDetalleResponse(
                poliza.getIdPoliza(),
                poliza.getEstadoPoliza().name(),
                poliza.getPrimaTotal(),
                poliza.getVigenciaInicio(),
                poliza.getVigenciaFin(),
                poliza.getFechaEmision(),
                ProductoMini.from(poliza.getProducto()),
                endosos
        );
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }

    private Poliza obtenerPropia(Usuario usuario, Integer idPoliza) {
        Cliente cliente = clienteDelUsuario(usuario);
        Poliza poliza = polizaRepository.findById(idPoliza)
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", idPoliza));
        if (!poliza.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La poliza no pertenece al usuario");
        }
        return poliza;
    }
}
