package com.serena.modules.comercial.suscripcion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoRequest;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoResponse;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import com.serena.modules.comercial.suscripcion.repository.EvaluacionRiesgoRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EvaluacionRiesgoService {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final EvaluacionRiesgoRepository repository;
    private final LeadCotizacionRepository cotizacionRepository;
    private final CalculadoraPrimaService calculadora;
    private final NotificacionService notificacionService;

    @Transactional
    public EvaluacionRiesgoResponse registrar(Integer idCotizacion, EvaluacionRiesgoRequest request) {
        LeadCotizacion lead = cotizacionRepository.findById(idCotizacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", idCotizacion));

        ProductoSeguro.TipoSeguro tipo = ProductoSeguro.TipoSeguro.valueOf(lead.getProductoInteres().name());
        Map<String, Object> mutableDatos = new java.util.HashMap<>(request.datosRiesgo());
        if (request.sumaAsegurada() != null) {
            mutableDatos.put("sumaAsegurada", request.sumaAsegurada());
        }
        String datosJson = serializar(mutableDatos);

        BigDecimal factor;
        ProductoSeguro producto = lead.getProducto();
        if (producto != null) {
            factor = calculadora.calcular(producto, datosJson, request.sumaAsegurada()).factorRiesgo();
        } else {
            factor = BigDecimal.ONE;
        }

        EvaluacionRiesgo evaluacion = repository.findByCotizacion(lead).orElseGet(() ->
                EvaluacionRiesgo.builder()
                        .cotizacion(lead)
                        .tipoSeguro(tipo)
                        .build()
        );
        evaluacion.setTipoSeguro(tipo);
        evaluacion.setDatosRiesgo(datosJson);
        evaluacion.setFactorRiesgo(factor);
        evaluacion.setEstadoSuscripcion(EvaluacionRiesgo.EstadoSuscripcion.PENDIENTE);

        EvaluacionRiesgo guardada = repository.save(evaluacion);

        notificacionService.crearParaPortal(Usuario.PortalAcceso.TECNICO,
                Notificacion.Tipo.GENERAL,
                "Evaluacion de riesgo pendiente",
                "Cotizacion #" + idCotizacion + " requiere revision tecnica",
                "/core/evaluaciones");

        return EvaluacionRiesgoResponse.from(guardada);
    }

    @Transactional(readOnly = true)
    public Optional<EvaluacionRiesgo> buscarPorCotizacion(LeadCotizacion lead) {
        return repository.findByCotizacion(lead);
    }

    @Transactional(readOnly = true)
    public EvaluacionRiesgoResponse obtenerPorCotizacion(Integer idCotizacion) {
        LeadCotizacion lead = cotizacionRepository.findById(idCotizacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", idCotizacion));
        return repository.findByCotizacion(lead)
                .map(EvaluacionRiesgoResponse::from)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Evaluacion de riesgo para cotizacion", idCotizacion));
    }

    @Transactional(readOnly = true)
    public List<EvaluacionRiesgoResponse> listar(EvaluacionRiesgo.EstadoSuscripcion estado) {
        var lista = estado != null
                ? repository.findByEstadoSuscripcionOrderByFechaEvaluacionDesc(estado)
                : repository.findAllByOrderByFechaEvaluacionDesc();
        return lista.stream().map(EvaluacionRiesgoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public EvaluacionRiesgoResponse obtener(Integer id) {
        return EvaluacionRiesgoResponse.from(
                repository.findById(id)
                        .orElseThrow(() -> new RecursoNoEncontradoException("EvaluacionRiesgo", id)));
    }

    @Transactional
    public EvaluacionRiesgoResponse aprobar(Integer id) {
        EvaluacionRiesgo ev = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("EvaluacionRiesgo", id));
        if (ev.getEstadoSuscripcion() != EvaluacionRiesgo.EstadoSuscripcion.PENDIENTE) {
            throw new IllegalStateException("Solo se puede aprobar evaluaciones PENDIENTES");
        }
        ev.setEstadoSuscripcion(EvaluacionRiesgo.EstadoSuscripcion.ACEPTADA);
        EvaluacionRiesgo guardada = repository.save(ev);

        notificarCambioEvaluacion(ev.getCotizacion(),
                "Tu evaluacion fue aprobada",
                "Ya puedes revisar la propuesta de cotizacion #" + ev.getCotizacion().getIdCotizacion(),
                "Evaluacion aprobada",
                "Cotizacion #" + ev.getCotizacion().getIdCotizacion() + " lista para generar propuesta");

        return EvaluacionRiesgoResponse.from(guardada);
    }

    @Transactional
    public EvaluacionRiesgoResponse rechazar(Integer id, String motivo) {
        EvaluacionRiesgo ev = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("EvaluacionRiesgo", id));
        if (ev.getEstadoSuscripcion() != EvaluacionRiesgo.EstadoSuscripcion.PENDIENTE) {
            throw new IllegalStateException("Solo se puede rechazar evaluaciones PENDIENTES");
        }
        ev.setEstadoSuscripcion(EvaluacionRiesgo.EstadoSuscripcion.RECHAZADA);
        ev.setMotivoRechazo(motivo);
        EvaluacionRiesgo guardada = repository.save(ev);

        notificarCambioEvaluacion(ev.getCotizacion(),
                "Tu evaluacion fue rechazada",
                "Cotizacion #" + ev.getCotizacion().getIdCotizacion() + ": " + motivo,
                "Evaluacion rechazada",
                "Cotizacion #" + ev.getCotizacion().getIdCotizacion() + " rechazada: " + motivo);

        return EvaluacionRiesgoResponse.from(guardada);
    }

    private void notificarCambioEvaluacion(LeadCotizacion lead,
                                           String tituloCliente, String mensajeCliente,
                                           String tituloAgente, String mensajeAgente) {
        if (lead.getCliente() != null && lead.getCliente().getPersona() != null
                && lead.getCliente().getPersona().getUsuario() != null) {
            notificacionService.crear(lead.getCliente().getPersona().getUsuario(),
                    Notificacion.Tipo.GENERAL, tituloCliente, mensajeCliente, "/asegurado/seguros");
        }
        if (lead.getEmpleadoAgente() != null && lead.getEmpleadoAgente().getPersona() != null
                && lead.getEmpleadoAgente().getPersona().getUsuario() != null) {
            notificacionService.crear(lead.getEmpleadoAgente().getPersona().getUsuario(),
                    Notificacion.Tipo.GENERAL, tituloAgente, mensajeAgente, "/comercial/leads");
        }
    }

    private String serializar(Map<String, Object> datos) {
        try {
            return MAPPER.writeValueAsString(datos != null ? datos : Map.of());
        } catch (Exception ex) {
            return "{}";
        }
    }
}
