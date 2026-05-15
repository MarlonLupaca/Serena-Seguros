package com.serena.modules.ejecutivo.riesgos.controller;

import com.serena.modules.ejecutivo.riesgos.dto.RiesgoRequest;
import com.serena.modules.ejecutivo.riesgos.dto.RiesgoResponse;
import com.serena.modules.ejecutivo.riesgos.dto.RiesgosResumenResponse;
import com.serena.modules.ejecutivo.riesgos.service.RiesgoService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/riesgos-corporativos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EJECUTIVO')")
public class RiesgoController {

    private final RiesgoService riesgoService;

    @GetMapping
    public ResponseEntity<RiesgosResumenResponse> resumen() {
        return ResponseEntity.ok(riesgoService.resumen());
    }

    @PostMapping
    public ResponseEntity<RiesgoResponse> crear(
            @Valid @RequestBody RiesgoRequest request,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(riesgoService.crear(request, usuario));
    }
}
