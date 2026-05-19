package com.serena.modules.comercial.propuestas.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record PropuestaResponse(
        Integer idPropuesta,
        Integer idCotizacion,
        BigDecimal sumaAsegurada,
        BigDecimal deducible,
        BigDecimal primaCalculada,
        String frecuenciaPago,
        Integer numeroCuotas,
        List<Cobertura> coberturas,
        String exclusionesTexto,
        Integer vigenciaMeses,
        LocalDate validaHasta,
        String estado,
        LocalDateTime fechaEmision,
        LocalDateTime fechaAceptacion
) {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static PropuestaResponse from(PropuestaPoliza p) {
        List<Cobertura> coberturas;
        try {
            List<Map<String, Object>> raw = MAPPER.readValue(p.getCoberturasJson(), List.class);
            coberturas = raw.stream().map(Cobertura::from).toList();
        } catch (Exception ex) {
            coberturas = List.of();
        }
        return new PropuestaResponse(
                p.getIdPropuesta(),
                p.getCotizacion().getIdCotizacion(),
                p.getSumaAsegurada(),
                p.getDeducible(),
                p.getPrimaCalculada(),
                p.getFrecuenciaPago().name(),
                p.getNumeroCuotas(),
                coberturas,
                p.getExclusionesTexto(),
                p.getVigenciaMeses(),
                p.getValidaHasta(),
                p.getEstado().name(),
                p.getFechaEmision(),
                p.getFechaAceptacion()
        );
    }

    public record Cobertura(String nombre, String descripcion, BigDecimal limite) {
        @SuppressWarnings("unchecked")
        public static Cobertura from(Map<String, Object> raw) {
            Object lim = raw.get("limite");
            BigDecimal limite = null;
            if (lim instanceof Number n) limite = new BigDecimal(n.toString());
            else if (lim instanceof String s && !s.isBlank()) limite = new BigDecimal(s);
            return new Cobertura(
                    (String) raw.get("nombre"),
                    (String) raw.get("descripcion"),
                    limite
            );
        }
    }
}
