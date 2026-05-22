package com.serena.modules.comercial.suscripcion.controller;

import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoResponse;
import com.serena.modules.comercial.suscripcion.dto.RechazarEvaluacionRequest;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import com.serena.modules.comercial.suscripcion.service.EvaluacionRiesgoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/evaluaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class EvaluacionTecnicoController {

    private final EvaluacionRiesgoService evaluacionService;

    @GetMapping
    public ResponseEntity<List<EvaluacionRiesgoResponse>> listar(
            @RequestParam(required = false) EvaluacionRiesgo.EstadoSuscripcion estado
    ) {
        return ResponseEntity.ok(evaluacionService.listar(estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluacionRiesgoResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(evaluacionService.obtener(id));
    }

    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<EvaluacionRiesgoResponse> aprobar(@PathVariable Integer id) {
        return ResponseEntity.ok(evaluacionService.aprobar(id));
    }

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<EvaluacionRiesgoResponse> rechazar(
            @PathVariable Integer id,
            @Valid @RequestBody RechazarEvaluacionRequest request
    ) {
        return ResponseEntity.ok(evaluacionService.rechazar(id, request.motivoRechazo()));
    }
}
