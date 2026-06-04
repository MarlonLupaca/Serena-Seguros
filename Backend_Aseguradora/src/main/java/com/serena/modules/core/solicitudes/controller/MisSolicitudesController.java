package com.serena.modules.core.solicitudes.controller;

import com.serena.modules.core.solicitudes.dto.SolicitudUnificadaResponse;
import com.serena.modules.core.solicitudes.service.MisSolicitudesService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mis-solicitudes")
@RequiredArgsConstructor
public class MisSolicitudesController {

    private final MisSolicitudesService misSolicitudesService;

    @GetMapping
    public ResponseEntity<List<SolicitudUnificadaResponse>> listarMisSolicitudes(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(misSolicitudesService.obtenerSolicitudesUnificadas(usuario));
    }
}
