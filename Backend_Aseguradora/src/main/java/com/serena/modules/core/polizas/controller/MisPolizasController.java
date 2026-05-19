package com.serena.modules.core.polizas.controller;

import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.service.CotizacionService;
import com.serena.modules.core.polizas.dto.CrearEndosoRequest;
import com.serena.modules.core.polizas.dto.DesignarBeneficiariosRequest;
import com.serena.modules.core.polizas.dto.EndosoResponse;
import com.serena.modules.core.polizas.dto.PolizaBeneficiarioResponse;
import com.serena.modules.core.polizas.dto.PolizaDetalleResponse;
import com.serena.modules.core.polizas.dto.PolizaResponse;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.service.PolizaService;
import com.serena.modules.seguridad.auth.entity.Usuario;
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
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mis-polizas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASEGURADO')")
public class MisPolizasController {

    private final PolizaService polizaService;
    private final CotizacionService cotizacionService;

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
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(polizaService.solicitarEndoso(usuario, id, request));
    }

    @PostMapping("/{id}/beneficiarios")
    public ResponseEntity<List<PolizaBeneficiarioResponse>> designarBeneficiarios(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id,
            @Valid @RequestBody DesignarBeneficiariosRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(polizaService.designarBeneficiarios(usuario, id, request));
    }

    @GetMapping("/{id}/datos-riesgo")
    public ResponseEntity<Map<String, Object>> datosRiesgo(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(polizaService.datosRiesgoDe(usuario, id));
    }

    @PostMapping("/{id}/renovar")
    public ResponseEntity<CotizacionResponse> renovar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cotizacionService.renovar(usuario, id));
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
