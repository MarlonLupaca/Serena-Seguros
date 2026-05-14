package com.serena.modules.core.productos.controller;

import com.serena.modules.core.productos.dto.ProductoRequest;
import com.serena.modules.core.productos.dto.ProductoResponse;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.service.ProductoSeguroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoSeguroController {

    private final ProductoSeguroService service;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listar(
            @RequestParam(required = false) ProductoSeguro.Estado estado,
            @RequestParam(required = false) ProductoSeguro.TipoSeguro tipo
    ) {
        return ResponseEntity.ok(service.listar(estado, tipo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
    public ResponseEntity<ProductoResponse> crear(
            @Valid @RequestBody ProductoRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
    public ResponseEntity<ProductoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProductoRequest request
    ) {
        return ResponseEntity.ok(service.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        service.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}
