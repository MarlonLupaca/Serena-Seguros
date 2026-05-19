package com.serena.shared.config.seeder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import com.serena.modules.comercial.propuestas.repository.PropuestaPolizaRepository;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import com.serena.modules.comercial.suscripcion.repository.EvaluacionRiesgoRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.entity.PolizaBeneficiario;
import com.serena.modules.core.polizas.repository.PolizaBeneficiarioRepository;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.tecnico.indemnizaciones.entity.Indemnizacion;
import com.serena.modules.tecnico.indemnizaciones.repository.IndemnizacionRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Siembra los datos del flujo realista de adquisicion:
 * evaluacion de riesgo, propuesta formal, beneficiarios por poliza, indemnizacion.
 * Idempotente: solo crea si no existe.
 */
@Component
@Order(11)
@RequiredArgsConstructor
public class FlujoAdquisicionSeeder implements CommandLineRunner {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final LeadCotizacionRepository leadRepository;
    private final EvaluacionRiesgoRepository evaluacionRepository;
    private final PropuestaPolizaRepository propuestaRepository;
    private final PolizaRepository polizaRepository;
    private final PolizaBeneficiarioRepository polizaBeneficiarioRepository;
    private final SiniestroRepository siniestroRepository;
    private final IndemnizacionRepository indemnizacionRepository;

    @Override
    @Transactional
    public void run(String... args) {
        completarCamposDePoliza();
        sembrarEvaluacionesYPropuestas();
        sembrarBeneficiariosPorPoliza();
        sembrarIndemnizaciones();
    }

    private void completarCamposDePoliza() {
        polizaRepository.findAll().forEach(p -> {
            boolean cambio = false;
            if (p.getFrecuenciaPago() == null) {
                p.setFrecuenciaPago(Poliza.FrecuenciaPago.MENSUAL);
                cambio = true;
            }
            if (p.getNumeroCuotas() == null) {
                p.setNumeroCuotas(12);
                cambio = true;
            }
            if (p.getSumaAsegurada() == null && p.getProducto() != null) {
                p.setSumaAsegurada(p.getProducto().getPrimaBase().multiply(new BigDecimal("60")));
                cambio = true;
            }
            if (p.getDeducible() == null) {
                p.setDeducible(new BigDecimal("250.00"));
                cambio = true;
            }
            if (cambio) polizaRepository.save(p);
        });
    }

    private void sembrarEvaluacionesYPropuestas() {
        var leads = leadRepository.findAll();
        if (leads.isEmpty()) return;
        int creados = 0;
        for (LeadCotizacion lead : leads) {
            if (creados >= 5) break;
            if (evaluacionRepository.findByCotizacion(lead).isPresent()) continue;
            ProductoSeguro.TipoSeguro tipo = ProductoSeguro.TipoSeguro.valueOf(lead.getProductoInteres().name());
            String datos = ejemploRiesgo(tipo);
            EvaluacionRiesgo eval = evaluacionRepository.save(EvaluacionRiesgo.builder()
                    .cotizacion(lead)
                    .tipoSeguro(tipo)
                    .datosRiesgo(datos)
                    .factorRiesgo(new BigDecimal("1.10"))
                    .estadoSuscripcion(EvaluacionRiesgo.EstadoSuscripcion.ACEPTADA)
                    .build());

            BigDecimal primaBase = lead.getPrimaEstimada() != null
                    ? lead.getPrimaEstimada()
                    : new BigDecimal("600.00");
            propuestaRepository.save(PropuestaPoliza.builder()
                    .cotizacion(lead)
                    .sumaAsegurada(primaBase.multiply(new BigDecimal("60")))
                    .deducible(new BigDecimal("250.00"))
                    .primaCalculada(primaBase.multiply(eval.getFactorRiesgo()))
                    .frecuenciaPago(PropuestaPoliza.FrecuenciaPago.MENSUAL)
                    .numeroCuotas(12)
                    .coberturasJson(ejemploCoberturas(tipo))
                    .exclusionesTexto("Exclusiones estandar segun condiciones particulares del producto.")
                    .vigenciaMeses(12)
                    .validaHasta(LocalDate.now().plusDays(15))
                    .estado(lead.getEstadoKanban() == LeadCotizacion.EstadoKanban.GANADO
                            ? PropuestaPoliza.Estado.ACEPTADA
                            : PropuestaPoliza.Estado.EMITIDA)
                    .fechaAceptacion(lead.getEstadoKanban() == LeadCotizacion.EstadoKanban.GANADO
                            ? LocalDateTime.now()
                            : null)
                    .build());
            creados++;
        }
    }

    private void sembrarBeneficiariosPorPoliza() {
        var polizas = polizaRepository.findAll();
        for (Poliza p : polizas) {
            if (!polizaBeneficiarioRepository.findByPoliza(p).isEmpty()) continue;
            var persona = p.getCliente().getPersona();
            polizaBeneficiarioRepository.save(PolizaBeneficiario.builder()
                    .poliza(p)
                    .nombres("Beneficiario1")
                    .apellidos(persona.getApellidos())
                    .parentesco("Conyuge")
                    .documentoIdentidad("DEMO-" + p.getIdPoliza() + "-A")
                    .porcentaje(new BigDecimal("60.00"))
                    .build());
            polizaBeneficiarioRepository.save(PolizaBeneficiario.builder()
                    .poliza(p)
                    .nombres("Beneficiario2")
                    .apellidos(persona.getApellidos())
                    .parentesco("Hijo(a)")
                    .documentoIdentidad("DEMO-" + p.getIdPoliza() + "-B")
                    .porcentaje(new BigDecimal("40.00"))
                    .build());
        }
    }

    private void sembrarIndemnizaciones() {
        var siniestros = siniestroRepository.findAll();
        int creadas = (int) indemnizacionRepository.count();
        for (Siniestro s : siniestros) {
            if (creadas >= 5) break;
            if (s.getEstadoResolucion() != Siniestro.EstadoResolucion.LIQUIDADO
                    && s.getEstadoResolucion() != Siniestro.EstadoResolucion.APROBADO) continue;
            if (!indemnizacionRepository.findBySiniestro(s).isEmpty()) continue;

            BigDecimal monto = s.getMontoReclamado().multiply(new BigDecimal("0.85"));
            indemnizacionRepository.save(Indemnizacion.builder()
                    .siniestro(s)
                    .montoAprobado(monto)
                    .montoPagado(s.getEstadoResolucion() == Siniestro.EstadoResolucion.LIQUIDADO
                            ? monto
                            : BigDecimal.ZERO)
                    .medioPago(Indemnizacion.MedioPago.TRANSFERENCIA)
                    .observaciones("Indemnizacion demo generada por seeder")
                    .fechaPago(s.getEstadoResolucion() == Siniestro.EstadoResolucion.LIQUIDADO
                            ? LocalDateTime.now().minusDays(5)
                            : null)
                    .build());
            creadas++;
        }
    }

    private String ejemploRiesgo(ProductoSeguro.TipoSeguro tipo) {
        Map<String, Object> datos = switch (tipo) {
            case VEHICULAR -> Map.of(
                    "marca", "Toyota", "modelo", "Yaris", "anio", 2022, "placa", "ABC-123",
                    "uso", "PERSONAL", "conductor_edad", 35, "siniestros_previos", 0);
            case VIDA -> Map.of(
                    "edad", 38, "peso", 72, "altura", 175,
                    "fumador", false, "preexistencias", false,
                    "ocupacion", "Ingeniero", "ingresos_mensuales", 6500);
            case SALUD -> Map.of(
                    "edad", 32, "antecedentes", "Ninguno", "plan_deseado", "COMPLETO");
            case HOGAR -> Map.of(
                    "direccion", "Av. Demo 123", "metros_cuadrados", 90,
                    "tipo_inmueble", "Departamento", "antiguedad_anios", 8);
            case VIAJE -> Map.of(
                    "destino", "Mexico", "duracion_dias", 10, "edades_viajeros", List.of(35, 8));
            case EMPRESA -> Map.of(
                    "rubro", "Servicios", "numero_empleados", 25, "valor_activos", 150000);
        };
        return toJson(datos);
    }

    private String ejemploCoberturas(ProductoSeguro.TipoSeguro tipo) {
        List<Map<String, Object>> coberturas = switch (tipo) {
            case VEHICULAR -> List.of(
                    Map.of("nombre", "Daños propios", "descripcion", "Colision o vuelco", "limite", 50000),
                    Map.of("nombre", "Responsabilidad civil", "descripcion", "Daños a terceros", "limite", 100000),
                    Map.of("nombre", "Robo total", "descripcion", "Cobertura por robo total", "limite", 30000));
            case VIDA -> List.of(
                    Map.of("nombre", "Fallecimiento", "descripcion", "Indemnizacion al beneficiario", "limite", 200000),
                    Map.of("nombre", "Invalidez permanente", "descripcion", "Indemnizacion por invalidez", "limite", 100000));
            case SALUD -> List.of(
                    Map.of("nombre", "Hospitalizacion", "descripcion", "Clinicas afiliadas", "limite", 50000),
                    Map.of("nombre", "Consulta ambulatoria", "descripcion", "Atencion medica", "limite", 2000));
            case HOGAR -> List.of(
                    Map.of("nombre", "Incendio", "descripcion", "Daños por incendio", "limite", 100000),
                    Map.of("nombre", "Robo", "descripcion", "Robo de bienes asegurados", "limite", 20000));
            case VIAJE -> List.of(
                    Map.of("nombre", "Asistencia medica", "descripcion", "Cobertura medica internacional", "limite", 50000),
                    Map.of("nombre", "Cancelacion", "descripcion", "Reembolso por cancelacion", "limite", 3000));
            case EMPRESA -> List.of(
                    Map.of("nombre", "Multirriesgo industrial", "descripcion", "Daños al patrimonio", "limite", 500000),
                    Map.of("nombre", "Responsabilidad civil", "descripcion", "Daños a terceros", "limite", 200000));
        };
        return toJson(coberturas);
    }

    private String toJson(Object value) {
        try {
            return MAPPER.writeValueAsString(value);
        } catch (Exception ex) {
            return "{}";
        }
    }
}
