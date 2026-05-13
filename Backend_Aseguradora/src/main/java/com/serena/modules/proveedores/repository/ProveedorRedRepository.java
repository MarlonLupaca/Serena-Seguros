package com.serena.modules.proveedores.repository;

import com.serena.modules.proveedores.entity.ProveedorRed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRedRepository
        extends JpaRepository<ProveedorRed, Integer> {

    List<ProveedorRed> findByEstado(ProveedorRed.Estado estado);

    List<ProveedorRed> findByRubro(ProveedorRed.Rubro rubro);

    List<ProveedorRed> findByEstadoAndRubro(
            ProveedorRed.Estado estado,
            ProveedorRed.Rubro rubro
    );
}
