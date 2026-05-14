package com.serena.modules.tecnico.siniestros.repository;

import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.entity.SiniestroProveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiniestroProveedorRepository
        extends JpaRepository<SiniestroProveedor, SiniestroProveedor.SiniestroProveedorId> {

    List<SiniestroProveedor> findBySiniestroOrderByFechaAsignacionDesc(Siniestro siniestro);
}
