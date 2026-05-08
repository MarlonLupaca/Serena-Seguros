package com.serena.modules.proveedores.controller;

import com.serena.modules.proveedores.dto.ProveedorRequest;
import com.serena.modules.proveedores.dto.ProveedorResponse;
import com.serena.modules.proveedores.entity.ProveedorRed;
import com.serena.modules.proveedores.service.ProveedorRedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/proveedores")
@RequiredArgsConstructor
public class ProveedorRedController {

    private final ProveedorRedService service;

    @GetMapping
    public ResponseEntity<List<ProveedorResponse>> listar(
            @RequestParam(required = false) ProveedorRed.Estado estado,
            @RequestParam(required = false) ProveedorRed.Rubro rubro
    ) {
        return ResponseEntity.ok(service.listar(estado, rubro));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TECNICO', 'OPERATIVO')")
    public ResponseEntity<ProveedorResponse> crear(
            @Valid @RequestBody ProveedorRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECNICO', 'OPERATIVO')")
    public ResponseEntity<ProveedorResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProveedorRequest request
    ) {
        return ResponseEntity.ok(service.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECNICO', 'OPERATIVO')")
    public ResponseEntity<Void> suspender(@PathVariable Integer id) {
        service.suspender(id);
        return ResponseEntity.noContent().build();
    }
}
