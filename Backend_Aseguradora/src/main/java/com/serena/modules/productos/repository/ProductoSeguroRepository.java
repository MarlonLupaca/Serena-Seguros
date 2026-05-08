package com.serena.modules.productos.repository;

import com.serena.modules.productos.entity.ProductoSeguro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoSeguroRepository
        extends JpaRepository<ProductoSeguro, Integer> {

    List<ProductoSeguro> findByEstado(ProductoSeguro.Estado estado);

    List<ProductoSeguro> findByTipoSeguro(ProductoSeguro.TipoSeguro tipo);

    List<ProductoSeguro> findByEstadoAndTipoSeguro(
            ProductoSeguro.Estado estado,
            ProductoSeguro.TipoSeguro tipo
    );
}
