package com.serena.modules.comercial.suscripcion.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Calcula la prima ajustada por factores de riesgo.
 * El payload {@code datosRiesgo} es un JSON cuya estructura depende del tipo de seguro
 * (ver {@code lib/riesgo/camposPorTipo.js} en el frontend).
 */
@Service
@RequiredArgsConstructor
public class CalculadoraPrimaService {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public Resultado calcular(ProductoSeguro producto, String datosRiesgoJson, BigDecimal sumaAsegurada) {
        BigDecimal primaBase = producto.getPrimaBase();
        BigDecimal factor = factorPorTipo(producto.getTipoSeguro(), datosRiesgoJson)
                .multiply(factorPorMonto(sumaAsegurada))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal prima = primaBase.multiply(factor).setScale(2, RoundingMode.HALF_UP);
        return new Resultado(prima, factor);
    }

    public BigDecimal factorPorEdad(Integer edad) {
        if (edad == null) return BigDecimal.ONE;
        if (edad < 25) return new BigDecimal("1.20");
        if (edad < 40) return new BigDecimal("1.00");
        if (edad < 60) return new BigDecimal("1.15");
        return new BigDecimal("1.40");
    }

    public BigDecimal factorPorMonto(BigDecimal monto) {
        if (monto == null) return BigDecimal.ONE;
        if (monto.compareTo(new BigDecimal("10000")) < 0) return new BigDecimal("0.80");
        if (monto.compareTo(new BigDecimal("50000")) < 0) return BigDecimal.ONE;
        if (monto.compareTo(new BigDecimal("100000")) < 0) return new BigDecimal("1.25");
        return new BigDecimal("1.60");
    }

    private BigDecimal factorPorTipo(ProductoSeguro.TipoSeguro tipo, String datosJson) {
        JsonNode datos = parse(datosJson);
        return switch (tipo) {
            case VEHICULAR -> factorVehicular(datos);
            case VIDA -> factorVida(datos);
            case SALUD -> factorSalud(datos);
            case HOGAR -> factorHogar(datos);
            case VIAJE -> factorViaje(datos);
            case EMPRESA -> factorEmpresa(datos);
        };
    }

    private BigDecimal factorVehicular(JsonNode datos) {
        BigDecimal factor = BigDecimal.ONE;
        Integer anio = optInt(datos, "anio");
        if (anio != null) {
            int antiguedad = java.time.Year.now().getValue() - anio;
            if (antiguedad <= 3) factor = factor.multiply(new BigDecimal("0.95"));
            else if (antiguedad <= 7) factor = factor.multiply(new BigDecimal("1.00"));
            else if (antiguedad <= 15) factor = factor.multiply(new BigDecimal("1.15"));
            else factor = factor.multiply(new BigDecimal("1.35"));
        }
        String uso = optText(datos, "uso");
        if ("COMERCIAL".equalsIgnoreCase(uso)) factor = factor.multiply(new BigDecimal("1.20"));
        Integer edadConductor = optInt(datos, "conductor_edad");
        factor = factor.multiply(factorPorEdad(edadConductor));
        Integer siniestros = optInt(datos, "siniestros_previos");
        if (siniestros != null && siniestros > 0) {
            factor = factor.multiply(BigDecimal.ONE.add(new BigDecimal("0.10").multiply(BigDecimal.valueOf(siniestros))));
        }
        return factor;
    }

    private BigDecimal factorVida(JsonNode datos) {
        BigDecimal factor = factorPorEdad(optInt(datos, "edad"));
        Boolean fumador = optBool(datos, "fumador");
        if (Boolean.TRUE.equals(fumador)) factor = factor.multiply(new BigDecimal("1.30"));
        Boolean preexistencias = optBool(datos, "preexistencias");
        if (Boolean.TRUE.equals(preexistencias)) factor = factor.multiply(new BigDecimal("1.20"));
        return factor;
    }

    private BigDecimal factorSalud(JsonNode datos) {
        BigDecimal factor = factorPorEdad(optInt(datos, "edad"));
        String plan = optText(datos, "plan_deseado");
        if ("COMPLETO".equalsIgnoreCase(plan)) factor = factor.multiply(new BigDecimal("1.40"));
        return factor;
    }

    private BigDecimal factorHogar(JsonNode datos) {
        BigDecimal factor = BigDecimal.ONE;
        Integer antiguedad = optInt(datos, "antiguedad_anios");
        if (antiguedad != null && antiguedad > 25) factor = factor.multiply(new BigDecimal("1.15"));
        Integer metros = optInt(datos, "metros_cuadrados");
        if (metros != null && metros > 150) factor = factor.multiply(new BigDecimal("1.10"));
        return factor;
    }

    private BigDecimal factorViaje(JsonNode datos) {
        BigDecimal factor = BigDecimal.ONE;
        Integer dias = optInt(datos, "duracion_dias");
        if (dias != null) {
            if (dias > 15) factor = factor.multiply(new BigDecimal("1.20"));
            if (dias > 30) factor = factor.multiply(new BigDecimal("1.30"));
        }
        return factor;
    }

    private BigDecimal factorEmpresa(JsonNode datos) {
        BigDecimal factor = BigDecimal.ONE;
        Integer empleados = optInt(datos, "numero_empleados");
        if (empleados != null && empleados > 50) factor = factor.multiply(new BigDecimal("1.30"));
        if (empleados != null && empleados > 200) factor = factor.multiply(new BigDecimal("1.50"));
        return factor;
    }

    private JsonNode parse(String json) {
        if (json == null || json.isBlank()) return MAPPER.createObjectNode();
        try {
            return MAPPER.readTree(json);
        } catch (Exception e) {
            return MAPPER.createObjectNode();
        }
    }

    private Integer optInt(JsonNode node, String field) {
        JsonNode n = node.get(field);
        return n == null || n.isNull() ? null : n.asInt();
    }

    private String optText(JsonNode node, String field) {
        JsonNode n = node.get(field);
        return n == null || n.isNull() ? null : n.asText();
    }

    private Boolean optBool(JsonNode node, String field) {
        JsonNode n = node.get(field);
        return n == null || n.isNull() ? null : n.asBoolean();
    }

    public record Resultado(BigDecimal primaCalculada, BigDecimal factorRiesgo) {}
}
