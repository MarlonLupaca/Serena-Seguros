package com.serena.modules.comercial.cotizaciones.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.service.CotizacionService;
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
