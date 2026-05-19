package com.serena.modules.comercial.suscripcion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoRequest;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoResponse;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import com.serena.modules.comercial.suscripcion.repository.EvaluacionRiesgoRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EvaluacionRiesgoService {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final EvaluacionRiesgoRepository repository;
    private final LeadCotizacionRepository cotizacionRepository;
    private final CalculadoraPrimaService calculadora;

    @Transactional
    public EvaluacionRiesgoResponse registrar(Integer idCotizacion, EvaluacionRiesgoRequest request) {
        LeadCotizacion lead = cotizacionRepository.findById(idCotizacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cotizacion", idCotizacion));

        ProductoSeguro.TipoSeguro tipo = ProductoSeguro.TipoSeguro.valueOf(lead.getProductoInteres().name());
        String datosJson = serializar(request.datosRiesgo());

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
        evaluacion.setEstadoSuscripcion(EvaluacionRiesgo.EstadoSuscripcion.ACEPTADA);

        return EvaluacionRiesgoResponse.from(repository.save(evaluacion));
    }

    @Transactional(readOnly = true)
    public Optional<EvaluacionRiesgo> buscarPorCotizacion(LeadCotizacion lead) {
        return repository.findByCotizacion(lead);
    }

    private String serializar(Map<String, Object> datos) {
        try {
            return MAPPER.writeValueAsString(datos != null ? datos : Map.of());
        } catch (Exception ex) {
            return "{}";
        }
    }
}
