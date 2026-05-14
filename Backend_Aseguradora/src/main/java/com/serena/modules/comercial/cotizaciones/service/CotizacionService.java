package com.serena.modules.comercial.cotizaciones.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.comercial.cotizaciones.dto.AsignarAgenteRequest;
import com.serena.modules.comercial.cotizaciones.dto.CambioEstadoCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CotizacionService {

    private final LeadCotizacionRepository cotizacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;
    private final ProductoSeguroRepository productoRepository;

    @Transactional
    public CotizacionResponse crear(Usuario usuario, CrearCotizacionRequest request) {
        Empleado agente = empleadoRepository.findAll().stream()
                .filter(e -> "COMERCIAL".equalsIgnoreCase(e.getArea()))
                .findFirst()
                .or(() -> empleadoRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Empleado disponible para asignar cotizacion", 0));

        BigDecimal prima = request.primaEstimada();
        if (prima == null && request.idProducto() != null) {
            ProductoSeguro p = productoRepository.findById(request.idProducto()).orElse(null);
            if (p != null) prima = p.getPrimaBase();
        }

        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .productoInteres(request.productoInteres())
                .estadoKanban(LeadCotizacion.EstadoKanban.NUEVO)
                .primaEstimada(prima)
                .build();
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    @Transactional(readOnly = true)
    public List<CotizacionResponse> listar(LeadCotizacion.EstadoKanban estado, Boolean soloMias, Usuario usuario) {
        Empleado agenteActual = soloMias != null && soloMias
                ? empleadoActual(usuario)
                : null;

        List<LeadCotizacion> leads;
        if (agenteActual != null && estado != null) {
            leads = cotizacionRepository.findByEmpleadoAgenteAndEstadoKanbanOrderByFechaIngresoDesc(agenteActual, estado);
        } else if (agenteActual != null) {
            leads = cotizacionRepository.findByEmpleadoAgenteOrderByFechaIngresoDesc(agenteActual);
        } else if (estado != null) {
            leads = cotizacionRepository.findByEstadoKanbanOrderByFechaIngresoDesc(estado);
        } else {
            leads = cotizacionRepository.findAllByOrderByFechaIngresoDesc();
        }
        return leads.stream().map(CotizacionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CotizacionResponse obtener(Integer id) {
        return CotizacionResponse.from(buscar(id));
    }

    @Transactional
    public CotizacionResponse cambiarEstado(Integer id, CambioEstadoCotizacionRequest request) {
        LeadCotizacion lead = buscar(id);
        lead.setEstadoKanban(request.estadoKanban());
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    @Transactional
    public CotizacionResponse asignarAgente(Integer id, AsignarAgenteRequest request) {
        LeadCotizacion lead = buscar(id);
        Empleado agente = empleadoRepository.findById(request.idEmpleadoAgente())
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado", request.idEmpleadoAgente()));
        lead.setEmpleadoAgente(agente);
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }

    private LeadCotizacion buscar(Integer id) {
        return cotizacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", id));
    }

    private Empleado empleadoActual(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(p -> empleadoRepository.findByPersona(p))
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado del usuario", usuario.getIdUsuario()));
    }
}
