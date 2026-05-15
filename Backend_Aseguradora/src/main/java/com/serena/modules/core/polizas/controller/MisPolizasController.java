package com.serena.modules.core.polizas.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.core.polizas.dto.CrearEndosoRequest;
import com.serena.modules.core.polizas.dto.EndosoResponse;
import com.serena.modules.core.polizas.dto.PolizaDetalleResponse;
import com.serena.modules.core.polizas.dto.PolizaResponse;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.service.PolizaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
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

    @GetMapping("/{id}/contrato")
    public ResponseEntity<byte[]> descargarContrato(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        String contenido = polizaService.generarContrato(usuario, id);
        byte[] bytes = contenido.getBytes(StandardCharsets.UTF_8);
        String filename = "contrato-poliza-" + id + ".txt";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }
}
