package com.serena.modules.cotizaciones.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.cotizaciones.dto.AsignarAgenteRequest;
import com.serena.modules.cotizaciones.dto.CambioEstadoCotizacionRequest;
import com.serena.modules.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.cotizaciones.service.CotizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cotizaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('COMERCIAL', 'EJECUTIVO')")
public class CotizacionesController {

    private final CotizacionService cotizacionService;

    @GetMapping
    public ResponseEntity<List<CotizacionResponse>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) LeadCotizacion.EstadoKanban estado,
            @RequestParam(value = "solo_mias", required = false) Boolean soloMias
    ) {
        return ResponseEntity.ok(cotizacionService.listar(estado, soloMias, usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CotizacionResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(cotizacionService.obtener(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CotizacionResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoCotizacionRequest request
    ) {
        return ResponseEntity.ok(cotizacionService.cambiarEstado(id, request));
    }

    @PatchMapping("/{id}/asignar")
    public ResponseEntity<CotizacionResponse> asignar(
            @PathVariable Integer id,
            @Valid @RequestBody AsignarAgenteRequest request
    ) {
        return ResponseEntity.ok(cotizacionService.asignarAgente(id, request));
    }
}
