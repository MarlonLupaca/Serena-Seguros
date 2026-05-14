package com.serena.modules.core.polizas.controller;

import com.serena.modules.core.polizas.dto.CambioEstadoPolizaRequest;
import com.serena.modules.core.polizas.dto.EmitirPolizaRequest;
import com.serena.modules.core.polizas.dto.PolizaDetalleResponse;
import com.serena.modules.core.polizas.dto.PolizaResponse;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.service.PolizaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/polizas")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class PolizaAdminController {

    private final PolizaService polizaService;

    @GetMapping
    public ResponseEntity<List<PolizaResponse>> listar(
            @RequestParam(required = false) Poliza.EstadoPoliza estado
    ) {
        return ResponseEntity.ok(polizaService.listarTodas(estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolizaDetalleResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(polizaService.detalleAdmin(id));
    }

    @PostMapping
    public ResponseEntity<PolizaResponse> emitir(@Valid @RequestBody EmitirPolizaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(polizaService.emitir(request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<PolizaResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoPolizaRequest request
    ) {
        return ResponseEntity.ok(polizaService.cambiarEstado(id, request));
    }

    @GetMapping("/renovaciones")
    public ResponseEntity<List<PolizaResponse>> renovaciones(
            @RequestParam(defaultValue = "30") int dias
    ) {
        return ResponseEntity.ok(polizaService.renovaciones(dias));
    }
}
