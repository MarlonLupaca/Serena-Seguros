package com.serena.modules.comercial.cotizaciones.controller;

import com.serena.modules.comercial.cotizaciones.dto.SimulacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.SimulacionResponse;
import com.serena.modules.comercial.cotizaciones.service.CotizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cotizar")
@RequiredArgsConstructor
public class SimuladorController {

    private final CotizacionService cotizacionService;

    @PostMapping("/simular")
    public ResponseEntity<SimulacionResponse> simular(@Valid @RequestBody SimulacionRequest request) {
        return ResponseEntity.ok(cotizacionService.simular(request));
    }
}
