package com.serena.modules.tecnico.validaciones.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.tecnico.validaciones.dto.RechazoRequest;
import com.serena.modules.tecnico.validaciones.dto.ValidacionResponse;
import com.serena.modules.tecnico.validaciones.entity.ValidacionDocumental;
import com.serena.modules.tecnico.validaciones.service.ValidacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/validaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class ValidacionController {

    private final ValidacionService validacionService;

    @GetMapping
    public ResponseEntity<List<ValidacionResponse>> listar(
            @RequestParam(required = false) ValidacionDocumental.Estado estado
    ) {
        return ResponseEntity.ok(validacionService.listar(estado));
    }

    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<ValidacionResponse> aprobar(
            @PathVariable Integer id,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(validacionService.aprobar(id, usuario));
    }

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<ValidacionResponse> rechazar(
            @PathVariable Integer id,
            @Valid @RequestBody RechazoRequest request,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(validacionService.rechazar(id, request, usuario));
    }

    @PatchMapping("/{id}/correccion")
    public ResponseEntity<ValidacionResponse> correccion(
            @PathVariable Integer id,
            @Valid @RequestBody RechazoRequest request,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(validacionService.solicitarCorreccion(id, request, usuario));
    }
}
