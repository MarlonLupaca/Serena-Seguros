package com.serena.modules.core.productos.controller;

import com.serena.modules.core.productos.dto.ProductoResponse;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/publico/productos")
@RequiredArgsConstructor
public class ProductoPublicoController {

    private final ProductoSeguroRepository repository;

    @GetMapping
    public ResponseEntity<Map<String, List<ProductoResponse>>> listarAgrupados() {
        Map<String, List<ProductoResponse>> agrupados = repository
                .findByEstado(ProductoSeguro.Estado.ACTIVO)
                .stream()
                .map(ProductoResponse::from)
                .collect(Collectors.groupingBy(ProductoResponse::tipoSeguro));
        return ResponseEntity.ok(agrupados);
    }

    @GetMapping("/{tipo}")
    public ResponseEntity<List<ProductoResponse>> listarPorTipo(
            @PathVariable String tipo
    ) {
        ProductoSeguro.TipoSeguro tipoEnum;
        try {
            tipoEnum = ProductoSeguro.TipoSeguro.valueOf(tipo.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
        List<ProductoResponse> productos = repository
                .findByEstadoAndTipoSeguro(ProductoSeguro.Estado.ACTIVO, tipoEnum)
                .stream()
                .map(ProductoResponse::from)
                .toList();
        return ResponseEntity.ok(productos);
    }
}
