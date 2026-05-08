package com.serena.modules.polizas.controller;

import com.serena.modules.polizas.dto.CambioEstadoEndosoRequest;
import com.serena.modules.polizas.dto.EndosoAdminResponse;
import com.serena.modules.polizas.entity.EndosoPoliza;
import com.serena.modules.polizas.repository.EndosoPolizaRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/endosos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class EndosoAdminController {

    private final EndosoPolizaRepository endosoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<EndosoAdminResponse>> listar(
            @RequestParam(required = false) EndosoPoliza.EstadoAprobacion estado
    ) {
        List<EndosoPoliza> lista = (estado != null)
                ? endosoRepository.findByEstadoAprobacionOrderByFechaSolicitudDesc(estado)
                : endosoRepository.findAllByOrderByFechaSolicitudDesc();
        return ResponseEntity.ok(lista.stream().map(EndosoAdminResponse::from).toList());
    }

    @PatchMapping("/{id}/estado")
    @Transactional
    public ResponseEntity<EndosoAdminResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoEndosoRequest request
    ) {
        EndosoPoliza endoso = endosoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Endoso", id));
        endoso.setEstadoAprobacion(request.estadoAprobacion());
        return ResponseEntity.ok(EndosoAdminResponse.from(endosoRepository.save(endoso)));
    }
}
