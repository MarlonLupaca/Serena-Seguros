package com.serena.modules.cuotas.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.cuotas.dto.CuotaResponse;
import com.serena.modules.cuotas.entity.Cuota;
import com.serena.modules.cuotas.service.CuotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mis-cuotas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASEGURADO')")
public class MisCuotasController {

    private final CuotaService cuotaService;

    @GetMapping
    public ResponseEntity<List<CuotaResponse>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) Cuota.EstadoPago estado
    ) {
        return ResponseEntity.ok(cuotaService.misCuotas(usuario, estado));
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<CuotaResponse> pagar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(cuotaService.pagar(usuario, id));
    }
}
