package com.serena.modules.comercial.comisiones.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.comercial.comisiones.dto.ComisionResponse;
import com.serena.modules.comercial.comisiones.entity.ComisionAgente;
import com.serena.modules.comercial.comisiones.service.ComisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ComisionController {

    private final ComisionService comisionService;

    @GetMapping("/api/v1/mis-comisiones")
    @PreAuthorize("hasRole('COMERCIAL')")
    public ResponseEntity<List<ComisionResponse>> misComisiones(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(value = "estado_pago", required = false) ComisionAgente.EstadoPago estado
    ) {
        return ResponseEntity.ok(comisionService.misComisiones(usuario, estado));
    }

    @GetMapping("/api/v1/comisiones")
    @PreAuthorize("hasAnyRole('EJECUTIVO', 'OPERATIVO')")
    public ResponseEntity<List<ComisionResponse>> listarTodas() {
        return ResponseEntity.ok(comisionService.listarTodas());
    }

    @PatchMapping("/api/v1/comisiones/{id}/pagar")
    @PreAuthorize("hasAnyRole('EJECUTIVO', 'OPERATIVO')")
    public ResponseEntity<ComisionResponse> pagar(@PathVariable Integer id) {
        return ResponseEntity.ok(comisionService.pagar(id));
    }
}
