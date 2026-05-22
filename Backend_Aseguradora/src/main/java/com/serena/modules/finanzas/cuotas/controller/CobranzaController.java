package com.serena.modules.finanzas.cuotas.controller;

import com.serena.modules.finanzas.cuotas.dto.CuotaResponse;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cobranza")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class CobranzaController {

    private final CuotaRepository cuotaRepository;
    private final AuditoriaService auditoria;
    private final NotificacionService notificaciones;
    private final PersonaRepository personaRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<CuotaResponse>> listar(
            @RequestParam(required = false) Cuota.EstadoPago estado
    ) {
        var lista = (estado != null)
                ? cuotaRepository.findByEstadoPagoOrderByFechaVencimientoAsc(estado)
                : cuotaRepository.findAllByOrderByFechaVencimientoAsc();
        return ResponseEntity.ok(lista.stream().map(CuotaResponse::from).toList());
    }

    @GetMapping("/resumen")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> resumen() {
        var lista = cuotaRepository.findAll();
        BigDecimal recaudado = lista.stream()
                .filter(c -> c.getEstadoPago() == Cuota.EstadoPago.PAGADO)
                .map(Cuota::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal porCobrar = lista.stream()
                .filter(c -> c.getEstadoPago() == Cuota.EstadoPago.PENDIENTE)
                .map(Cuota::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal vencido = lista.stream()
                .filter(c -> c.getEstadoPago() == Cuota.EstadoPago.VENCIDO)
                .map(Cuota::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> r = new HashMap<>();
        r.put("recaudado", recaudado);
        r.put("por_cobrar", porCobrar);
        r.put("vencido", vencido);
        r.put("total_cuotas", lista.size());
        return ResponseEntity.ok(r);
    }

    @PatchMapping("/{id}/pagar")
    @Transactional
    public ResponseEntity<CuotaResponse> marcarPagada(@PathVariable Integer id) {
        Cuota c = cuotaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cuota", id));
        c.setEstadoPago(Cuota.EstadoPago.PAGADO);
        auditoria.registrar("cuota_pagada", "cobranza",
                "Cuota #" + id + " - poliza " + c.getPoliza().getIdPoliza() + " - monto " + c.getMonto());

        Persona persona = c.getPoliza().getCliente().getPersona();
        if (persona != null && persona.getUsuario() != null) {
            notificaciones.crear(persona.getUsuario(), Notificacion.Tipo.COBRANZA,
                    "Pago confirmado - cuota " + c.getNumeroCuota(),
                    "Se registro el pago de la cuota #" + c.getNumeroCuota() + " por S/ " + c.getMonto(),
                    "/asegurado/pagos");
        }

        notificaciones.crearParaPortal(Usuario.PortalAcceso.COMERCIAL,
                Notificacion.Tipo.COBRANZA,
                "Pago confirmado por finanzas",
                "Cuota #" + c.getNumeroCuota() + " poliza #" + c.getPoliza().getIdPoliza(),
                "/comercial/leads");

        return ResponseEntity.ok(CuotaResponse.from(cuotaRepository.save(c)));
    }

    @PostMapping("/importar")
    @Transactional
    public ResponseEntity<Map<String, Object>> importar(@RequestParam("archivo") MultipartFile archivo) {
        int conciliadas = 0;
        int noEncontradas = 0;
        int yaPagadas = 0;
        int filasInvalidas = 0;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(archivo.getInputStream(), StandardCharsets.UTF_8))) {

            String linea;
            boolean primera = true;
            while ((linea = reader.readLine()) != null) {
                String fila = linea.trim();
                if (fila.isEmpty()) continue;
                if (primera && fila.toLowerCase().startsWith("id_cuota")) {
                    primera = false;
                    continue;
                }
                primera = false;
                String[] partes = fila.split(",");
                if (partes.length == 0) {
                    filasInvalidas++;
                    continue;
                }
                try {
                    int idCuota = Integer.parseInt(partes[0].replaceAll("\"", "").trim());
                    Cuota c = cuotaRepository.findById(idCuota).orElse(null);
                    if (c == null) {
                        noEncontradas++;
                        continue;
                    }
                    if (c.getEstadoPago() == Cuota.EstadoPago.PAGADO) {
                        yaPagadas++;
                        continue;
                    }
                    c.setEstadoPago(Cuota.EstadoPago.PAGADO);
                    cuotaRepository.save(c);
                    conciliadas++;
                } catch (NumberFormatException e) {
                    filasInvalidas++;
                }
            }
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("mensaje", "No se pudo procesar el archivo: " + e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }

        auditoria.registrar("cobranza_import", "cobranza",
                "Conciliadas " + conciliadas + " · Ya pagadas " + yaPagadas
                        + " · No encontradas " + noEncontradas + " · Invalidas " + filasInvalidas);

        Map<String, Object> r = new HashMap<>();
        r.put("conciliadas", conciliadas);
        r.put("ya_pagadas", yaPagadas);
        r.put("no_encontradas", noEncontradas);
        r.put("filas_invalidas", filasInvalidas);
        return ResponseEntity.ok(r);
    }
}
