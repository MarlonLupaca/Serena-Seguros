package com.serena.modules.proveedores.service;

import com.serena.modules.proveedores.dto.ProveedorRequest;
import com.serena.modules.proveedores.dto.ProveedorResponse;
import com.serena.modules.proveedores.entity.ProveedorRed;
import com.serena.modules.proveedores.repository.ProveedorRedRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProveedorRedService {

    private final ProveedorRedRepository repository;

    @Transactional(readOnly = true)
    public List<ProveedorResponse> listar(
            ProveedorRed.Estado estado,
            ProveedorRed.Rubro rubro
    ) {
        List<ProveedorRed> proveedores;
        if (estado != null && rubro != null) {
            proveedores = repository.findByEstadoAndRubro(estado, rubro);
        } else if (estado != null) {
            proveedores = repository.findByEstado(estado);
        } else if (rubro != null) {
            proveedores = repository.findByRubro(rubro);
        } else {
            proveedores = repository.findAll();
        }
        return proveedores.stream().map(ProveedorResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProveedorResponse obtener(Integer id) {
        return ProveedorResponse.from(buscar(id));
    }

    @Transactional
    public ProveedorResponse crear(ProveedorRequest request) {
        ProveedorRed p = ProveedorRed.builder()
                .rubro(request.rubro())
                .nombre(request.nombre())
                .ciudad(request.ciudad())
                .ratingInterno(request.ratingInterno())
                .estado(ProveedorRed.Estado.ACTIVO)
                .build();
        return ProveedorResponse.from(repository.save(p));
    }

    @Transactional
    public ProveedorResponse actualizar(Integer id, ProveedorRequest request) {
        ProveedorRed p = buscar(id);
        p.setRubro(request.rubro());
        p.setNombre(request.nombre());
        p.setCiudad(request.ciudad());
        p.setRatingInterno(request.ratingInterno());
        return ProveedorResponse.from(repository.save(p));
    }

    @Transactional
    public void suspender(Integer id) {
        ProveedorRed p = buscar(id);
        p.setEstado(ProveedorRed.Estado.SUSPENDIDO);
        repository.save(p);
    }

    private ProveedorRed buscar(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor", id));
    }
}
