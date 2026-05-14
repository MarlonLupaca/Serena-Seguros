package com.serena.modules.tecnico.siniestros.controller;

import com.serena.modules.tecnico.siniestros.dto.AsignarAnalistaRequest;
import com.serena.modules.tecnico.siniestros.dto.CambioEstadoSiniestroRequest;
import com.serena.modules.tecnico.siniestros.dto.SiniestroAdminResponse;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.service.SiniestroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/siniestros")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class SiniestroAdminController {

    private final SiniestroService siniestroService;

    @GetMapping
    public ResponseEntity<List<SiniestroAdminResponse>> listar(
            @RequestParam(required = false) Siniestro.EstadoResolucion estado
    ) {
        return ResponseEntity.ok(siniestroService.listarTodos(estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiniestroAdminResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(siniestroService.obtenerAdmin(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SiniestroAdminResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoSiniestroRequest request
    ) {
        return ResponseEntity.ok(siniestroService.cambiarEstado(id, request));
    }

    @PatchMapping("/{id}/asignar")
    public ResponseEntity<SiniestroAdminResponse> asignar(
            @PathVariable Integer id,
            @Valid @RequestBody AsignarAnalistaRequest request
    ) {
        return ResponseEntity.ok(siniestroService.asignarAnalista(id, request));
    }
}
