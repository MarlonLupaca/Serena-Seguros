package com.serena.modules.finanzas.compras.controller;

import com.serena.modules.finanzas.compras.dto.*;
import com.serena.modules.finanzas.compras.entity.ProveedorInterno;
import com.serena.modules.finanzas.compras.entity.SolicitudCompra;
import com.serena.modules.finanzas.compras.service.ComprasService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/compras")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class ComprasController {

    private final ComprasService comprasService;

    @GetMapping("/solicitudes")
    public ResponseEntity<List<SolicitudCompraResponse>> listarSolicitudes(
            @RequestParam(required = false) SolicitudCompra.Estado estado
    ) {
        return ResponseEntity.ok(comprasService.listarSolicitudes(estado));
    }

    @PostMapping("/solicitudes")
    public ResponseEntity<SolicitudCompraResponse> crearSolicitud(
            @Valid @RequestBody SolicitudCompraRequest request,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comprasService.crearSolicitud(request, usuario));
    }

    @PatchMapping("/solicitudes/{id}/estado")
    public ResponseEntity<SolicitudCompraResponse> cambiarEstadoSolicitud(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoSolicitudRequest request
    ) {
        return ResponseEntity.ok(comprasService.cambiarEstadoSolicitud(id, request));
    }

    @GetMapping("/proveedores")
    public ResponseEntity<List<ProveedorInternoResponse>> listarProveedores(
            @RequestParam(required = false) ProveedorInterno.Estado estado
    ) {
        return ResponseEntity.ok(comprasService.listarProveedores(estado));
    }

    @PostMapping("/proveedores")
    public ResponseEntity<ProveedorInternoResponse> crearProveedor(
            @Valid @RequestBody ProveedorInternoRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comprasService.crearProveedor(request));
    }

    @GetMapping("/ordenes")
    public ResponseEntity<List<OrdenCompraResponse>> listarOrdenes() {
        return ResponseEntity.ok(comprasService.listarOrdenes());
    }

    @PostMapping("/ordenes")
    public ResponseEntity<OrdenCompraResponse> crearOrden(@Valid @RequestBody OrdenCompraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comprasService.crearOrden(request));
    }
}
