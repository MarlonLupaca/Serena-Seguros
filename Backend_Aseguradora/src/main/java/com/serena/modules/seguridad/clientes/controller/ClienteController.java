package com.serena.modules.seguridad.clientes.controller;

import com.serena.modules.seguridad.clientes.dto.CambioEstadoCrmRequest;
import com.serena.modules.seguridad.clientes.dto.ClienteResponse;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('COMERCIAL', 'TECNICO', 'EJECUTIVO')")
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listar(
            @RequestParam(value = "estado_crm", required = false) Cliente.EstadoCrm estadoCrm
    ) {
        return ResponseEntity.ok(clienteService.listar(estadoCrm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.obtener(id));
    }

    @PatchMapping("/{id}/estado-crm")
    public ResponseEntity<ClienteResponse> cambiarEstadoCrm(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoCrmRequest request
    ) {
        return ResponseEntity.ok(clienteService.cambiarEstadoCrm(id, request));
    }
}
