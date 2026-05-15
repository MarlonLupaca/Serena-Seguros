package com.serena.modules.tecnico.siniestros.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.tecnico.siniestros.dto.CrearSiniestroRequest;
import com.serena.modules.tecnico.siniestros.dto.SiniestroDetalleResponse;
import com.serena.modules.tecnico.siniestros.dto.SiniestroResponse;
import com.serena.modules.tecnico.siniestros.service.SiniestroService;
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
    public ResponseEntity<SiniestroDetalleResponse> obtener(
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
