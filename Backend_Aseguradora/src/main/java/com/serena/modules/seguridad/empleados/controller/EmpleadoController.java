package com.serena.modules.seguridad.empleados.controller;

import com.serena.modules.seguridad.empleados.dto.EmpleadoResponse;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/empleados")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'OPERATIVO', 'EJECUTIVO')")
public class EmpleadoController {

    private final EmpleadoRepository empleadoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<EmpleadoResponse>> listar(
            @RequestParam(required = false) String area
    ) {
        var lista = (area != null && !area.isBlank())
                ? empleadoRepository.findByAreaIgnoreCaseOrderByIdEmpleadoAsc(area)
                : empleadoRepository.findAllByOrderByIdEmpleadoAsc();
        return ResponseEntity.ok(lista.stream().map(EmpleadoResponse::from).toList());
    }
}
