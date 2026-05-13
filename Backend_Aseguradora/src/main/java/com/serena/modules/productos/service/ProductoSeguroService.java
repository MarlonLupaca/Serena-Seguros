package com.serena.modules.productos.service;

import com.serena.modules.productos.dto.ProductoRequest;
import com.serena.modules.productos.dto.ProductoResponse;
import com.serena.modules.productos.entity.ProductoSeguro;
import com.serena.modules.productos.repository.ProductoSeguroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoSeguroService {

    private final ProductoSeguroRepository repository;

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(
            ProductoSeguro.Estado estado,
            ProductoSeguro.TipoSeguro tipo
    ) {
        List<ProductoSeguro> productos;
        if (estado != null && tipo != null) {
            productos = repository.findByEstadoAndTipoSeguro(estado, tipo);
        } else if (estado != null) {
            productos = repository.findByEstado(estado);
        } else if (tipo != null) {
            productos = repository.findByTipoSeguro(tipo);
        } else {
            productos = repository.findAll();
        }
        return productos.stream().map(ProductoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(Integer id) {
        return ProductoResponse.from(buscar(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        ProductoSeguro p = ProductoSeguro.builder()
                .nombre(request.nombre())
                .tipoSeguro(request.tipoSeguro())
                .primaBase(request.primaBase())
                .limitesCobertura(request.limitesCobertura())
                .restriccionesEdad(
                        request.restriccionesEdad() != null ? request.restriccionesEdad() : 18
                )
                .tasas(request.tasas() != null ? request.tasas() : BigDecimal.ZERO)
                .estado(ProductoSeguro.Estado.ACTIVO)
                .build();
        return ProductoResponse.from(repository.save(p));
    }

    @Transactional
    public ProductoResponse actualizar(Integer id, ProductoRequest request) {
        ProductoSeguro p = buscar(id);
        p.setNombre(request.nombre());
        p.setTipoSeguro(request.tipoSeguro());
        p.setPrimaBase(request.primaBase());
        p.setLimitesCobertura(request.limitesCobertura());
        if (request.restriccionesEdad() != null) {
            p.setRestriccionesEdad(request.restriccionesEdad());
        }
        if (request.tasas() != null) {
            p.setTasas(request.tasas());
        }
        return ProductoResponse.from(repository.save(p));
    }

    @Transactional
    public void desactivar(Integer id) {
        ProductoSeguro p = buscar(id);
        p.setEstado(ProductoSeguro.Estado.INACTIVO);
        repository.save(p);
    }

    private ProductoSeguro buscar(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
    }
}
