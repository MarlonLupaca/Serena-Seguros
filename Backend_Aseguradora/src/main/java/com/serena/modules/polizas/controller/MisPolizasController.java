package com.serena.modules.polizas.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.polizas.dto.CrearEndosoRequest;
import com.serena.modules.polizas.dto.EndosoResponse;
import com.serena.modules.polizas.dto.PolizaDetalleResponse;
import com.serena.modules.polizas.dto.PolizaResponse;
import com.serena.modules.polizas.entity.Poliza;
import com.serena.modules.polizas.service.PolizaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mis-polizas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASEGURADO')")
public class MisPolizasController {

    private final PolizaService polizaService;

    @GetMapping
    public ResponseEntity<List<PolizaResponse>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) Poliza.EstadoPoliza estado
    ) {
        return ResponseEntity.ok(polizaService.misPolizas(usuario, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolizaDetalleResponse> detalle(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(polizaService.miPolizaDetalle(usuario, id));
    }

    @PostMapping("/{id}/endosos")
    public ResponseEntity<EndosoResponse> solicitarEndoso(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id,
            @Valid @RequestBody CrearEndosoRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(polizaService.solicitarEndoso(usuario, id, request));
    }
}
