package com.serena.modules.tecnico.indemnizaciones.controller;

import com.serena.modules.tecnico.indemnizaciones.dto.IndemnizacionResponse;
import com.serena.modules.tecnico.indemnizaciones.dto.RegistrarIndemnizacionRequest;
import com.serena.modules.tecnico.indemnizaciones.service.IndemnizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/siniestros/{idSiniestro}/indemnizacion")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO','OPERATIVO','EJECUTIVO')")
public class IndemnizacionController {

    private final IndemnizacionService indemnizacionService;

    @PostMapping
    public ResponseEntity<IndemnizacionResponse> registrar(
            @PathVariable Integer idSiniestro,
            @Valid @RequestBody RegistrarIndemnizacionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(indemnizacionService.registrar(idSiniestro, request));
    }

    @GetMapping
    public ResponseEntity<List<IndemnizacionResponse>> listar(@PathVariable Integer idSiniestro) {
        return ResponseEntity.ok(indemnizacionService.listarPorSiniestro(idSiniestro));
    }
}
