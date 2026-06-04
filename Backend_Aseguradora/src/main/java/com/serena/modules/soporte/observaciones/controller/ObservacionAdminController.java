package com.serena.modules.soporte.observaciones.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.soporte.observaciones.dto.ObservacionRequest;
import com.serena.modules.soporte.observaciones.dto.ObservacionResponse;
import com.serena.modules.soporte.observaciones.service.ObservacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/observaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'COMERCIAL')")
public class ObservacionAdminController {

    private final ObservacionService observacionService;

    @GetMapping
    public ResponseEntity<List<ObservacionResponse>> listar(
            @RequestParam String tipoReferencia,
            @RequestParam Integer idReferencia
    ) {
        return ResponseEntity.ok(observacionService.listar(tipoReferencia, idReferencia));
    }

    @PostMapping
    public ResponseEntity<ObservacionResponse> agregar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam String tipoReferencia,
            @RequestParam Integer idReferencia,
            @Valid @RequestBody ObservacionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(observacionService.agregar(tipoReferencia, idReferencia, usuario, "TECNICO", request));
    }
}
