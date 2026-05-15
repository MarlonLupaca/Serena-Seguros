package com.serena.modules.seguridad.perfil.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.perfil.dto.BeneficiarioRequest;
import com.serena.modules.seguridad.perfil.dto.BeneficiarioResponse;
import com.serena.modules.seguridad.perfil.dto.CambioPasswordRequest;
import com.serena.modules.seguridad.perfil.dto.PerfilResponse;
import com.serena.modules.seguridad.perfil.dto.PerfilUpdateRequest;
import com.serena.modules.seguridad.perfil.dto.PreferenciaRequest;
import com.serena.modules.seguridad.perfil.dto.PreferenciaResponse;
import com.serena.modules.seguridad.perfil.service.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping
    public ResponseEntity<PerfilResponse> miPerfil(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(perfilService.obtener(usuario));
    }

    @PutMapping
    public ResponseEntity<PerfilResponse> actualizar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody PerfilUpdateRequest request
    ) {
        return ResponseEntity.ok(perfilService.actualizar(usuario, request));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> cambiarPassword(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CambioPasswordRequest request
    ) {
        perfilService.cambiarPassword(usuario, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/beneficiarios")
    public ResponseEntity<List<BeneficiarioResponse>> beneficiarios(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(perfilService.listarBeneficiarios(usuario));
    }

    @PutMapping("/beneficiarios")
    public ResponseEntity<List<BeneficiarioResponse>> reemplazarBeneficiarios(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody List<BeneficiarioRequest> request
    ) {
        return ResponseEntity.ok(perfilService.reemplazarBeneficiarios(usuario, request));
    }

    @GetMapping("/preferencias")
    public ResponseEntity<PreferenciaResponse> preferencias(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(perfilService.obtenerPreferencias(usuario));
    }

    @PutMapping("/preferencias")
    public ResponseEntity<PreferenciaResponse> actualizarPreferencias(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody PreferenciaRequest request
    ) {
        return ResponseEntity.ok(perfilService.actualizarPreferencias(usuario, request));
    }
}
