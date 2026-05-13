package com.serena.modules.campanas.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.campanas.dto.CampanaResponse;
import com.serena.modules.campanas.dto.CrearCampanaRequest;
import com.serena.modules.campanas.dto.RegistroEnvioRequest;
import com.serena.modules.campanas.service.CampanaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mis-campanas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMERCIAL')")
public class MisCampanasController {

    private final CampanaService campanaService;

    @GetMapping
    public ResponseEntity<List<CampanaResponse>> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(campanaService.misCampanas(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampanaResponse> obtener(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(campanaService.obtener(usuario, id));
    }

    @PostMapping
    public ResponseEntity<CampanaResponse> crear(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CrearCampanaRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campanaService.crear(usuario, request));
    }

    @PatchMapping("/{id}/envio")
    public ResponseEntity<CampanaResponse> registrarEnvio(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id,
            @Valid @RequestBody RegistroEnvioRequest request
    ) {
        return ResponseEntity.ok(campanaService.registrarEnvio(usuario, id, request));
    }
}
