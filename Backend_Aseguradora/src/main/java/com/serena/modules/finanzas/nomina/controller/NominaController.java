package com.serena.modules.finanzas.nomina.controller;

import com.serena.modules.finanzas.nomina.dto.DetallePlanillaResponse;
import com.serena.modules.finanzas.nomina.dto.PlanillaResponse;
import com.serena.modules.finanzas.nomina.dto.ProcesarPlanillaRequest;
import com.serena.modules.finanzas.nomina.service.NominaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nomina")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class NominaController {

    private final NominaService nominaService;

    @GetMapping("/planillas")
    public ResponseEntity<List<PlanillaResponse>> listar() {
        return ResponseEntity.ok(nominaService.listar());
    }

    @GetMapping("/planillas/{id}/detalles")
    public ResponseEntity<List<DetallePlanillaResponse>> detalles(@PathVariable Integer id) {
        return ResponseEntity.ok(nominaService.detalles(id));
    }

    @GetMapping("/planillas/resumen")
    public ResponseEntity<PlanillaResponse> resumen(@RequestParam String periodo) {
        return ResponseEntity.ok(nominaService.resumen(periodo));
    }

    @PostMapping("/planillas")
    public ResponseEntity<PlanillaResponse> procesar(@Valid @RequestBody ProcesarPlanillaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nominaService.procesar(request));
    }
}
