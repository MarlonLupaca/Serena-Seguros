package com.serena.modules.siniestros.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.siniestros.dto.CrearSiniestroRequest;
import com.serena.modules.siniestros.dto.SiniestroResponse;
import com.serena.modules.siniestros.service.SiniestroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mis-siniestros")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASEGURADO')")
public class MisSiniestrosController {

    private final SiniestroService siniestroService;

    @GetMapping
    public ResponseEntity<List<SiniestroResponse>> listar(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(siniestroService.misSiniestros(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiniestroResponse> obtener(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(siniestroService.miSiniestro(usuario, id));
    }

    @PostMapping
    public ResponseEntity<SiniestroResponse> reportar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CrearSiniestroRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(siniestroService.reportar(usuario, request));
    }
}
