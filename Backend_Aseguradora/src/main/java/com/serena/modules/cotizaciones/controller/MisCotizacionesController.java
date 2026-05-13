package com.serena.modules.cotizaciones.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.cotizaciones.service.CotizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mis-cotizaciones")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASEGURADO')")
public class MisCotizacionesController {

    private final CotizacionService cotizacionService;

    @PostMapping
    public ResponseEntity<CotizacionResponse> crear(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CrearCotizacionRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cotizacionService.crear(usuario, request));
    }
}
