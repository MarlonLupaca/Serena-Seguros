package com.serena.modules.ejecutivo.riesgos.service;

import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.ejecutivo.riesgos.dto.AlertaCalculada;
import com.serena.modules.ejecutivo.riesgos.dto.RiesgoRequest;
import com.serena.modules.ejecutivo.riesgos.dto.RiesgoResponse;
import com.serena.modules.ejecutivo.riesgos.dto.RiesgosResumenResponse;
import com.serena.modules.ejecutivo.riesgos.entity.RiesgoCorporativo;
import com.serena.modules.ejecutivo.riesgos.repository.RiesgoRepository;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroProveedorRepository;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RiesgoService {

    private final RiesgoRepository riesgoRepository;
    private final PolizaRepository polizaRepository;
    private final SiniestroRepository siniestroRepository;
    private final SiniestroProveedorRepository siniestroProveedorRepository;
    private final CuotaRepository cuotaRepository;
    private final AuditoriaService auditoria;

    @Transactional(readOnly = true)
    public RiesgosResumenResponse resumen() {
        List<AlertaCalculada> alertas = calcularAlertas();
        List<RiesgoResponse> manuales = riesgoRepository.findAllByOrderByFechaRegistroDesc()
                .stream()
                .map(RiesgoResponse::from)
                .toList();
        return new RiesgosResumenResponse(alertas, manuales);
    }

    @Transactional
    public RiesgoResponse crear(RiesgoRequest request, Usuario usuario) {
        RiesgoCorporativo r = RiesgoCorporativo.builder()
                .tipo(request.tipo())
                .descripcion(request.descripcion())
                .severidad(request.severidad())
                .areaAfectada(request.areaAfectada())
                .registradoPor(usuario)
                .build();
        r = riesgoRepository.save(r);
        auditoria.registrar("riesgo_creado", "riesgos",
                "RSK-" + r.getIdRiesgo() + " · " + r.getTipo().name() + " · " + r.getSeveridad().name());
        return RiesgoResponse.from(r);
    }

    private List<AlertaCalculada> calcularAlertas() {
        List<AlertaCalculada> alertas = new ArrayList<>();

        // 1. Concentracion por producto: si un producto concentra > 60% de polizas activas
        alertaConcentracion().ifPresent(alertas::add);

        // 2. Alta siniestralidad: ratio siniestros/polizas globalmente
        alertaSiniestralidad().ifPresent(alertas::add);

        // 3. Cartera morosa: % cuotas vencidas
        alertaMora().ifPresent(alertas::add);

        // 4. Dependencia proveedor critico: si un proveedor maneja > 40% de siniestros asignados
        alertaProveedor().ifPresent(alertas::add);

        // 5. Riesgos regulatorios (estaticos por ahora)
        alertas.add(new AlertaCalculada(
                "REGULATORIO",
                "Cumplimiento SBS al dia",
                "Recordatorio: revisar reportes mensuales y reservas tecnicas antes del 5 de cada mes.",
                "BAJA",
                BigDecimal.ZERO,
                "info"
        ));

        return alertas;
    }

    private java.util.Optional<AlertaCalculada> alertaConcentracion() {
        List<Poliza> activas = polizaRepository.findByEstadoPolizaOrderByFechaEmisionDesc(Poliza.EstadoPoliza.ACTIVA);
        if (activas.isEmpty()) return java.util.Optional.empty();

        Map<String, Long> porProducto = new HashMap<>();
        for (Poliza p : activas) {
            String tipo = p.getProducto().getTipoSeguro().name();
            porProducto.merge(tipo, 1L, Long::sum);
        }

        String topTipo = null;
        long topCount = 0;
        for (var e : porProducto.entrySet()) {
            if (e.getValue() > topCount) {
                topCount = e.getValue();
                topTipo = e.getKey();
            }
        }
        if (topTipo == null) return java.util.Optional.empty();

        BigDecimal porcentaje = BigDecimal.valueOf(topCount)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(activas.size()), 2, RoundingMode.HALF_UP);

        String severidad = porcentaje.compareTo(BigDecimal.valueOf(60)) > 0 ? "ALTA"
                : porcentaje.compareTo(BigDecimal.valueOf(40)) > 0 ? "MEDIA" : "BAJA";

        return java.util.Optional.of(new AlertaCalculada(
                "CONCENTRACION",
                "Concentracion en producto " + topTipo,
                topCount + " polizas activas representan el " + porcentaje + "% de la cartera. "
                        + "Considera diversificar la oferta o limitar exposicion.",
                severidad,
                porcentaje,
                "%"
        ));
    }

    private java.util.Optional<AlertaCalculada> alertaSiniestralidad() {
        long totalPolizas = polizaRepository.count();
        if (totalPolizas == 0) return java.util.Optional.empty();

        long siniestrosActivos = siniestroRepository.findAllByOrderByFechaReporteDesc().stream()
                .filter(s -> s.getEstadoResolucion() != Siniestro.EstadoResolucion.FINALIZADO
                        && s.getEstadoResolucion() != Siniestro.EstadoResolucion.RECHAZADO)
                .count();

        BigDecimal indice = BigDecimal.valueOf(siniestrosActivos)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalPolizas), 2, RoundingMode.HALF_UP);

        String severidad = indice.compareTo(BigDecimal.valueOf(50)) > 0 ? "CRITICA"
                : indice.compareTo(BigDecimal.valueOf(30)) > 0 ? "ALTA"
                : indice.compareTo(BigDecimal.valueOf(15)) > 0 ? "MEDIA" : "BAJA";

        return java.util.Optional.of(new AlertaCalculada(
                "SINIESTRALIDAD",
                "Indice de siniestralidad global",
                siniestrosActivos + " siniestros vigentes sobre " + totalPolizas + " polizas (" + indice + "%). "
                        + "Revisa los productos con mayor incidencia.",
                severidad,
                indice,
                "%"
        ));
    }

    private java.util.Optional<AlertaCalculada> alertaMora() {
        List<Cuota> todas = cuotaRepository.findAll();
        if (todas.isEmpty()) return java.util.Optional.empty();

        LocalDate hoy = LocalDate.now();
        long vencidas = todas.stream()
                .filter(c -> c.getEstadoPago() == Cuota.EstadoPago.VENCIDO
                        || (c.getEstadoPago() == Cuota.EstadoPago.PENDIENTE && c.getFechaVencimiento().isBefore(hoy)))
                .count();
        if (vencidas == 0) {
            return java.util.Optional.of(new AlertaCalculada(
                    "MORA", "Cartera al dia", "No hay cuotas vencidas. Excelente desempeno.",
                    "BAJA", BigDecimal.ZERO, "%"
            ));
        }

        BigDecimal indice = BigDecimal.valueOf(vencidas)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(todas.size()), 2, RoundingMode.HALF_UP);

        String severidad = indice.compareTo(BigDecimal.valueOf(20)) > 0 ? "CRITICA"
                : indice.compareTo(BigDecimal.valueOf(10)) > 0 ? "ALTA"
                : indice.compareTo(BigDecimal.valueOf(5)) > 0 ? "MEDIA" : "BAJA";

        return java.util.Optional.of(new AlertaCalculada(
                "MORA",
                "Mora de cartera",
                vencidas + " cuotas vencidas (" + indice + "% del total). Acelera gestion de cobranza.",
                severidad,
                indice,
                "%"
        ));
    }

    private java.util.Optional<AlertaCalculada> alertaProveedor() {
        var asignaciones = siniestroProveedorRepository.findAll();
        if (asignaciones.isEmpty()) return java.util.Optional.empty();

        Map<String, Long> porProveedor = new HashMap<>();
        for (var sp : asignaciones) {
            String nombre = sp.getProveedor() != null ? sp.getProveedor().getNombre() : "Desconocido";
            porProveedor.merge(nombre, 1L, Long::sum);
        }
        String topNombre = null;
        long topCount = 0;
        for (var e : porProveedor.entrySet()) {
            if (e.getValue() > topCount) {
                topCount = e.getValue();
                topNombre = e.getKey();
            }
        }
        if (topNombre == null) return java.util.Optional.empty();

        BigDecimal porcentaje = BigDecimal.valueOf(topCount)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(asignaciones.size()), 2, RoundingMode.HALF_UP);

        String severidad = porcentaje.compareTo(BigDecimal.valueOf(40)) > 0 ? "ALTA"
                : porcentaje.compareTo(BigDecimal.valueOf(25)) > 0 ? "MEDIA" : "BAJA";

        return java.util.Optional.of(new AlertaCalculada(
                "PROVEEDOR",
                "Dependencia del proveedor " + topNombre,
                topNombre + " maneja " + topCount + " asignaciones (" + porcentaje + "%). "
                        + "Diversifica la red para reducir riesgo de interrupcion.",
                severidad,
                porcentaje,
                "%"
        ));
    }
}
