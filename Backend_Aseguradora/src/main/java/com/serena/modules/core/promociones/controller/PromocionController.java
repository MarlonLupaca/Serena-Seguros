package com.serena.modules.core.promociones.controller;

import com.serena.modules.core.promociones.dto.PromocionResponse;
import com.serena.modules.core.promociones.service.PromocionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promociones")
@RequiredArgsConstructor
public class PromocionController {

    private final PromocionService promocionService;

    @GetMapping
    public ResponseEntity<List<PromocionResponse>> listar() {
        return ResponseEntity.ok(promocionService.listarActivas());
    }
}
