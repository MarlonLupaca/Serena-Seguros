package com.serena.modules.tecnico.siniestros.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.tecnico.siniestros.dto.SiniestroAdminResponse;
import com.serena.modules.tecnico.siniestros.service.SiniestroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comercial/siniestros")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('COMERCIAL', 'EJECUTIVO')")
public class SiniestroComercialController {

    private final SiniestroService siniestroService;

    @GetMapping
    public ResponseEntity<List<SiniestroAdminResponse>> listar(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(siniestroService.siniestrosDeAgente(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiniestroAdminResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(siniestroService.obtenerAdmin(id));
    }
}
