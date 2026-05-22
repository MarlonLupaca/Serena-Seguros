package com.serena.modules.comercial.propuestas.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.comercial.propuestas.dto.GenerarPropuestaRequest;
import com.serena.modules.comercial.propuestas.dto.PropuestaResponse;
import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import com.serena.modules.comercial.propuestas.repository.PropuestaPolizaRepository;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import com.serena.modules.comercial.suscripcion.service.CalculadoraPrimaService;
import com.serena.modules.comercial.suscripcion.service.EvaluacionRiesgoService;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PropuestaService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final int DIAS_VIGENCIA_OFERTA = 15;

    private final PropuestaPolizaRepository repository;
    private final LeadCotizacionRepository cotizacionRepository;
    private final EvaluacionRiesgoService evaluacionService;
    private final CalculadoraPrimaService calculadora;
    private final NotificacionService notificacionService;

    @Transactional
    public PropuestaResponse generar(Integer idCotizacion, GenerarPropuestaRequest request) {
        LeadCotizacion lead = cotizacionRepository.findById(idCotizacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", idCotizacion));
        EvaluacionRiesgo evaluacion = evaluacionService.buscarPorCotizacion(lead)
                .orElseThrow(() -> new IllegalStateException(
                        "Debe registrarse la evaluacion de riesgo antes de generar una propuesta"));
        if (evaluacion.getEstadoSuscripcion() != EvaluacionRiesgo.EstadoSuscripcion.ACEPTADA) {
            throw new IllegalStateException(
                    "La evaluacion de riesgo debe estar ACEPTADA por el area tecnica. Estado actual: "
                            + evaluacion.getEstadoSuscripcion());
        }
        ProductoSeguro producto = lead.getProducto();
        if (producto == null) {
            throw new IllegalStateException("La cotizacion no tiene un producto asociado");
        }

        var calc = calculadora.calcular(producto, evaluacion.getDatosRiesgo(), request.sumaAsegurada());
        BigDecimal deducible = request.deducible() != null ? request.deducible() : BigDecimal.ZERO;
        PropuestaPoliza.FrecuenciaPago frecuencia = request.frecuenciaPago() != null
                ? request.frecuenciaPago()
                : PropuestaPoliza.FrecuenciaPago.MENSUAL;
        Integer numeroCuotas = request.numeroCuotas() != null && request.numeroCuotas() > 0
                ? request.numeroCuotas()
                : cuotasPorDefecto(frecuencia);
        Integer vigenciaMeses = request.vigenciaMeses() != null && request.vigenciaMeses() > 0
                ? request.vigenciaMeses()
                : 12;

        PropuestaPoliza propuesta = PropuestaPoliza.builder()
                .cotizacion(lead)
                .sumaAsegurada(request.sumaAsegurada())
                .deducible(deducible)
                .primaCalculada(calc.primaCalculada())
                .frecuenciaPago(frecuencia)
                .numeroCuotas(numeroCuotas)
                .coberturasJson(coberturasJson(producto))
                .exclusionesTexto(exclusionesPara(producto.getTipoSeguro()))
                .vigenciaMeses(vigenciaMeses)
                .validaHasta(LocalDate.now().plusDays(DIAS_VIGENCIA_OFERTA))
                .estado(PropuestaPoliza.Estado.EMITIDA)
                .build();

        lead.setEstadoKanban(LeadCotizacion.EstadoKanban.EN_PROPUESTA);
        lead.setPrimaEstimada(calc.primaCalculada());
        cotizacionRepository.save(lead);

        PropuestaPoliza guardada = repository.save(propuesta);

        if (lead.getCliente() != null && lead.getCliente().getPersona() != null
                && lead.getCliente().getPersona().getUsuario() != null) {
            notificacionService.crear(lead.getCliente().getPersona().getUsuario(),
                    Notificacion.Tipo.GENERAL,
                    "Tu propuesta esta lista",
                    "Revisa la propuesta para cotizacion #" + idCotizacion + " valida hasta " + guardada.getValidaHasta(),
                    "/asegurado/seguros");
        }

        return PropuestaResponse.from(guardada);
    }

    @Transactional(readOnly = true)
    public PropuestaResponse obtenerVigente(Integer idCotizacion) {
        LeadCotizacion lead = cotizacionRepository.findById(idCotizacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", idCotizacion));
        PropuestaPoliza p = repository.findFirstByCotizacionOrderByFechaEmisionDesc(lead)
                .orElseThrow(() -> new RecursoNoEncontradoException("Propuesta para cotizacion", idCotizacion));
        return PropuestaResponse.from(p);
    }

    @Transactional(readOnly = true)
    public PropuestaPoliza buscar(Integer idPropuesta) {
        return repository.findById(idPropuesta)
                .orElseThrow(() -> new RecursoNoEncontradoException("Propuesta", idPropuesta));
    }

    private int cuotasPorDefecto(PropuestaPoliza.FrecuenciaPago f) {
        return switch (f) {
            case UNICO -> 1;
            case MENSUAL -> 12;
            case TRIMESTRAL -> 4;
            case ANUAL -> 1;
        };
    }

    private String coberturasJson(ProductoSeguro producto) {
        List<Map<String, Object>> coberturas = switch (producto.getTipoSeguro()) {
            case VEHICULAR -> List.of(
                    Map.of("nombre", "Daños propios", "descripcion", "Reparacion del vehiculo por colision o vuelco",
                            "limite", 50000),
                    Map.of("nombre", "Responsabilidad civil", "descripcion", "Daños a terceros",
                            "limite", 100000),
                    Map.of("nombre", "Robo total", "descripcion", "Cobertura por robo total del vehiculo",
                            "limite", 30000),
                    Map.of("nombre", "Asistencia en ruta", "descripcion", "Grua y asistencia 24/7",
                            "limite", 0)
            );
            case VIDA -> List.of(
                    Map.of("nombre", "Fallecimiento", "descripcion", "Indemnizacion al beneficiario",
                            "limite", 200000),
                    Map.of("nombre", "Invalidez permanente", "descripcion", "Indemnizacion por invalidez",
                            "limite", 100000),
                    Map.of("nombre", "Gastos funerarios", "descripcion", "Cobertura de gastos funerarios",
                            "limite", 5000)
            );
            case SALUD -> List.of(
                    Map.of("nombre", "Hospitalizacion", "descripcion", "Atencion en clinicas afiliadas",
                            "limite", 50000),
                    Map.of("nombre", "Consulta ambulatoria", "descripcion", "Atencion medica general",
                            "limite", 2000),
                    Map.of("nombre", "Medicamentos", "descripcion", "Cobertura de farmacia segun receta",
                            "limite", 1500)
            );
            case HOGAR -> List.of(
                    Map.of("nombre", "Incendio y rayo", "descripcion", "Daños por incendio",
                            "limite", 100000),
                    Map.of("nombre", "Robo", "descripcion", "Robo de bienes asegurados",
                            "limite", 20000),
                    Map.of("nombre", "Responsabilidad civil familiar", "descripcion", "Daños a terceros",
                            "limite", 30000)
            );
            case VIAJE -> List.of(
                    Map.of("nombre", "Asistencia medica en el exterior", "descripcion", "Atencion medica",
                            "limite", 50000),
                    Map.of("nombre", "Cancelacion de viaje", "descripcion", "Reembolso por cancelacion",
                            "limite", 3000),
                    Map.of("nombre", "Equipaje perdido", "descripcion", "Reposicion por extravio",
                            "limite", 1500)
            );
            case EMPRESA -> List.of(
                    Map.of("nombre", "Multirriesgo industrial", "descripcion", "Daños al patrimonio",
                            "limite", 500000),
                    Map.of("nombre", "Responsabilidad civil comercial", "descripcion", "Daños a terceros",
                            "limite", 200000),
                    Map.of("nombre", "Lucro cesante", "descripcion", "Perdida de utilidades por siniestro",
                            "limite", 100000)
            );
            case SOAT -> List.of(
                    Map.of("nombre", "Gastos medicos", "descripcion", "Atencion medica por accidente de transito",
                            "limite", 5000),
                    Map.of("nombre", "Invalidez permanente", "descripcion", "Indemnizacion por invalidez",
                            "limite", 17500),
                    Map.of("nombre", "Muerte accidental", "descripcion", "Indemnizacion por fallecimiento",
                            "limite", 17500)
            );
            case MASCOTAS -> List.of(
                    Map.of("nombre", "Consultas veterinarias", "descripcion", "Consultas ilimitadas en red afiliada",
                            "limite", 3000),
                    Map.of("nombre", "Cirugia y emergencias", "descripcion", "Cobertura quirurgica",
                            "limite", 8000),
                    Map.of("nombre", "Vacunacion", "descripcion", "Plan de vacunacion anual",
                            "limite", 500)
            );
        };
        try {
            return MAPPER.writeValueAsString(coberturas);
        } catch (Exception ex) {
            return "[]";
        }
    }

    private String exclusionesPara(ProductoSeguro.TipoSeguro tipo) {
        return switch (tipo) {
            case VEHICULAR -> "Conduccion bajo efecto de alcohol o drogas; uso del vehiculo sin licencia vigente; "
                    + "competencias deportivas; preexistencias mecanicas no declaradas.";
            case VIDA -> "Suicidio dentro del primer año de vigencia; preexistencias no declaradas; "
                    + "actos delictivos del asegurado.";
            case SALUD -> "Tratamientos esteticos no reconstructivos; preexistencias no declaradas; "
                    + "lesiones por practicas extremas no informadas.";
            case HOGAR -> "Daños por desgaste o falta de mantenimiento; actos de guerra o terrorismo no contratados; "
                    + "joyas y valores fuera de caja fuerte.";
            case VIAJE -> "Viajes a zonas con alerta sanitaria oficial; deportes de alto riesgo no declarados; "
                    + "preexistencias no informadas.";
            case EMPRESA -> "Daños por desgaste; fraude interno; eventos politicos o de guerra no contratados.";
            case SOAT -> "Accidentes fuera del territorio nacional; conduccion sin licencia vigente.";
            case MASCOTAS -> "Preexistencias no declaradas; mascotas sin vacunas al dia; razas excluidas por normativa.";
        };
    }
}
