package com.serena.modules.ejecutivo.controller;

import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.comercial.comisiones.entity.ComisionAgente;
import com.serena.modules.comercial.comisiones.repository.ComisionAgenteRepository;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.ejecutivo.entity.AprobacionCritica;
import com.serena.modules.ejecutivo.repository.AprobacionCriticaRepository;
import com.serena.modules.ejecutivo.repository.ObjetivoCorporativoRepository;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ejecutivo")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EJECUTIVO')")
public class EjecutivoController {

    private final PolizaRepository polizaRepo;
    private final SiniestroRepository siniestroRepo;
    private final CuotaRepository cuotaRepo;
    private final ComisionAgenteRepository comisionRepo;
    private final LeadCotizacionRepository cotizacionRepo;
    private final ClienteRepository clienteRepo;
    private final EmpleadoRepository empleadoRepo;
    private final AprobacionCriticaRepository aprobacionRepo;
    private final ObjetivoCorporativoRepository objetivoRepo;

    @GetMapping("/resumen")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> resumen() {
        var polizas = polizaRepo.findAll();
        var siniestros = siniestroRepo.findAll();
        var cuotas = cuotaRepo.findAll();
        var hoy = LocalDate.now();

        long polizasActivas = polizas.stream()
                .filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA)
                .count();
        long siniestrosPendientes = siniestros.stream()
                .filter(s -> s.getEstadoResolucion() != Siniestro.EstadoResolucion.LIQUIDADO
                        && s.getEstadoResolucion() != Siniestro.EstadoResolucion.RECHAZADO)
                .count();
        BigDecimal recaudacionMes = cuotas.stream()
                .filter(c -> c.getEstadoPago() == Cuota.EstadoPago.PAGADO)
                .filter(c -> c.getFechaVencimiento() != null
                        && c.getFechaVencimiento().getMonth() == hoy.getMonth()
                        && c.getFechaVencimiento().getYear() == hoy.getYear())
                .map(Cuota::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("polizas_activas", polizasActivas);
        data.put("siniestros_pendientes", siniestrosPendientes);
        data.put("clientes_totales", clienteRepo.count());
        data.put("empleados_totales", empleadoRepo.count());
        data.put("recaudacion_mes", recaudacionMes);
        data.put("aprobaciones_pendientes", aprobacionRepo.countByEstadoGerencial(AprobacionCritica.EstadoGerencial.PENDIENTE));
        data.put("objetivos_total", objetivoRepo.count());
        return ResponseEntity.ok(data);
    }

    @GetMapping("/produccion")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> produccion() {
        var polizas = polizaRepo.findAll();
        long total = polizas.size();
        long activas = polizas.stream().filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA).count();
        long pendientes = polizas.stream().filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.PENDIENTE).count();
        long vencidas = polizas.stream().filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.VENCIDA).count();
        long canceladas = polizas.stream().filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.CANCELADA).count();

        BigDecimal primaTotalActiva = polizas.stream()
                .filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA)
                .map(Poliza::getPrimaTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> porProducto = new LinkedHashMap<>();
        for (Poliza p : polizas) {
            String tipo = p.getProducto() != null && p.getProducto().getTipoSeguro() != null
                    ? p.getProducto().getTipoSeguro().name()
                    : "OTRO";
            porProducto.merge(tipo, 1L, Long::sum);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("total_polizas", total);
        data.put("activas", activas);
        data.put("pendientes", pendientes);
        data.put("vencidas", vencidas);
        data.put("canceladas", canceladas);
        data.put("prima_total_activa", primaTotalActiva);
        data.put("por_producto", porProducto);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/comercial")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> comercial() {
        var leads = cotizacionRepo.findAll();
        var comisiones = comisionRepo.findAll();

        long total = leads.size();
        long ganados = leads.stream().filter(l -> l.getEstadoKanban() == LeadCotizacion.EstadoKanban.GANADO).count();
        long perdidos = leads.stream().filter(l -> l.getEstadoKanban() == LeadCotizacion.EstadoKanban.PERDIDO).count();
        BigDecimal tasaConversion = total > 0
                ? BigDecimal.valueOf(ganados).multiply(BigDecimal.valueOf(100)).divide(BigDecimal.valueOf(total), 1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Long> porEstado = new LinkedHashMap<>();
        for (LeadCotizacion l : leads) {
            porEstado.merge(l.getEstadoKanban().name(), 1L, Long::sum);
        }

        BigDecimal comisionesTotal = comisiones.stream()
                .map(ComisionAgente::getMontoGenerado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal comisionesPagadas = comisiones.stream()
                .filter(c -> c.getEstadoPago() == ComisionAgente.EstadoPago.PAGADA)
                .map(ComisionAgente::getMontoGenerado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal comisionesPendientes = comisionesTotal.subtract(comisionesPagadas);

        Map<String, Object> data = new HashMap<>();
        data.put("leads_total", total);
        data.put("leads_ganados", ganados);
        data.put("leads_perdidos", perdidos);
        data.put("tasa_conversion", tasaConversion);
        data.put("por_estado", porEstado);
        data.put("comisiones_total", comisionesTotal);
        data.put("comisiones_pagadas", comisionesPagadas);
        data.put("comisiones_pendientes", comisionesPendientes);
        data.put("clientes_totales", clienteRepo.count());
        return ResponseEntity.ok(data);
    }

    @GetMapping("/siniestralidad")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> siniestralidad() {
        List<Siniestro> siniestros = siniestroRepo.findAll();
        long total = siniestros.size();
        long aprobados = siniestros.stream().filter(s -> s.getEstadoResolucion() == Siniestro.EstadoResolucion.APROBADO).count();
        long rechazados = siniestros.stream().filter(s -> s.getEstadoResolucion() == Siniestro.EstadoResolucion.RECHAZADO).count();
        long liquidados = siniestros.stream().filter(s -> s.getEstadoResolucion() == Siniestro.EstadoResolucion.LIQUIDADO).count();
        long enRevision = siniestros.stream().filter(s -> s.getEstadoResolucion() == Siniestro.EstadoResolucion.EN_REVISION).count();
        long reportados = siniestros.stream().filter(s -> s.getEstadoResolucion() == Siniestro.EstadoResolucion.REPORTADO).count();

        BigDecimal montoReclamadoTotal = siniestros.stream()
                .map(Siniestro::getMontoReclamado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal montoLiquidado = siniestros.stream()
                .filter(s -> s.getEstadoResolucion() == Siniestro.EstadoResolucion.LIQUIDADO
                        || s.getEstadoResolucion() == Siniestro.EstadoResolucion.APROBADO)
                .map(Siniestro::getMontoReclamado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long polizasActivas = polizaRepo.findAll().stream()
                .filter(p -> p.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA)
                .count();
        BigDecimal indice = polizasActivas > 0
                ? BigDecimal.valueOf(total).multiply(BigDecimal.valueOf(100)).divide(BigDecimal.valueOf(polizasActivas), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Long> porEstado = new LinkedHashMap<>();
        porEstado.put("REPORTADO", reportados);
        porEstado.put("EN_REVISION", enRevision);
        porEstado.put("APROBADO", aprobados);
        porEstado.put("RECHAZADO", rechazados);
        porEstado.put("LIQUIDADO", liquidados);

        Map<String, Object> data = new HashMap<>();
        data.put("total_siniestros", total);
        data.put("monto_reclamado", montoReclamadoTotal);
        data.put("monto_liquidado", montoLiquidado);
        data.put("indice_siniestralidad", indice);
        data.put("por_estado", porEstado);
        return ResponseEntity.ok(data);
    }
}
