package com.serena.modules.finanzas.contabilidad.controller;

import com.serena.modules.finanzas.contabilidad.dto.*;
import com.serena.modules.finanzas.contabilidad.service.ContabilidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contabilidad")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class ContabilidadController {

    private final ContabilidadService contabilidadService;

    @GetMapping("/facturas")
    public ResponseEntity<List<FacturaResponse>> facturas() {
        return ResponseEntity.ok(contabilidadService.listarFacturas());
    }

    @GetMapping("/asientos")
    public ResponseEntity<List<AsientoResponse>> asientos() {
        return ResponseEntity.ok(contabilidadService.listarAsientos());
    }

    @GetMapping("/cuentas")
    public ResponseEntity<List<CuentaContableResponse>> cuentas() {
        return ResponseEntity.ok(contabilidadService.listarCuentas());
    }

    @GetMapping("/balance")
    public ResponseEntity<BalanceResponse> balance() {
        return ResponseEntity.ok(contabilidadService.balance());
    }

    @GetMapping("/estado-resultados")
    public ResponseEntity<EstadoResultadosResponse> estadoResultados() {
        return ResponseEntity.ok(contabilidadService.estadoResultados());
    }
}
