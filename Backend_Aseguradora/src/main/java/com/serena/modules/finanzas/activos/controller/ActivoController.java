package com.serena.modules.finanzas.activos.controller;

import com.serena.modules.finanzas.activos.dto.ActivoRequest;
import com.serena.modules.finanzas.activos.dto.ActivoResponse;
import com.serena.modules.finanzas.activos.entity.ActivoInterno;
import com.serena.modules.finanzas.activos.repository.ActivoInternoRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class ActivoController {

    private final ActivoInternoRepository activoRepository;
    private final EmpleadoRepository empleadoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ActivoResponse>> listar(
            @RequestParam(required = false) ActivoInterno.Estado estado
    ) {
        var lista = (estado != null)
                ? activoRepository.findByEstadoOrderByIdActivoDesc(estado)
                : activoRepository.findAllByOrderByIdActivoDesc();
        return ResponseEntity.ok(lista.stream().map(ActivoResponse::from).toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ActivoResponse> crear(@Valid @RequestBody ActivoRequest request) {
        Empleado empleado = null;
        if (request.idEmpleadoAsignado() != null) {
            empleado = empleadoRepository.findById(request.idEmpleadoAsignado())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Empleado", request.idEmpleadoAsignado()));
        }
        ActivoInterno a = ActivoInterno.builder()
                .empleadoAsignado(empleado)
                .tipo(request.tipo())
                .marca(request.marca())
                .valorDepreciacion(request.valorDepreciacion())
                .estado(request.estado() != null ? request.estado() : ActivoInterno.Estado.OPERATIVO)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(ActivoResponse.from(activoRepository.save(a)));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ActivoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ActivoRequest request
    ) {
        ActivoInterno a = activoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Activo", id));
        Empleado empleado = null;
        if (request.idEmpleadoAsignado() != null) {
            empleado = empleadoRepository.findById(request.idEmpleadoAsignado())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Empleado", request.idEmpleadoAsignado()));
        }
        a.setEmpleadoAsignado(empleado);
        a.setTipo(request.tipo());
        a.setMarca(request.marca());
        a.setValorDepreciacion(request.valorDepreciacion());
        if (request.estado() != null) a.setEstado(request.estado());
        return ResponseEntity.ok(ActivoResponse.from(activoRepository.save(a)));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        ActivoInterno a = activoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Activo", id));
        a.setEstado(ActivoInterno.Estado.BAJA);
        activoRepository.save(a);
        return ResponseEntity.noContent().build();
    }
}
