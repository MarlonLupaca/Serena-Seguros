package com.serena.modules.cuotas.controller;

import com.serena.modules.auditoria.service.AuditoriaService;
import com.serena.modules.cuotas.dto.CuotaResponse;
import com.serena.modules.cuotas.entity.Cuota;
import com.serena.modules.cuotas.repository.CuotaRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
        return ResponseEntity.ok(CuotaResponse.from(cuotaRepository.save(c)));
    }
}
