package com.serena.modules.reaseguro.controller;

import com.serena.modules.polizas.entity.Poliza;
import com.serena.modules.polizas.repository.PolizaRepository;
import com.serena.modules.reaseguro.dto.ReaseguroRequest;
import com.serena.modules.reaseguro.dto.ReaseguroResponse;
import com.serena.modules.reaseguro.entity.Reaseguro;
import com.serena.modules.reaseguro.repository.ReaseguroRepository;
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
@RequestMapping("/api/v1/reaseguros")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class ReaseguroController {

    private final ReaseguroRepository reaseguroRepository;
    private final PolizaRepository polizaRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ReaseguroResponse>> listar() {
        return ResponseEntity.ok(
                reaseguroRepository.findAllByOrderByIdReaseguroDesc()
                        .stream().map(ReaseguroResponse::from).toList()
        );
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ReaseguroResponse> crear(@Valid @RequestBody ReaseguroRequest request) {
        Poliza poliza = polizaRepository.findById(request.idPoliza())
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", request.idPoliza()));
        Reaseguro r = Reaseguro.builder()
                .poliza(poliza)
                .riesgoRetenido(request.riesgoRetenido())
                .riesgoCedido(request.riesgoCedido())
                .reaseguradoraAsociada(request.reaseguradoraAsociada())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(ReaseguroResponse.from(reaseguroRepository.save(r)));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ReaseguroResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ReaseguroRequest request
    ) {
        Reaseguro r = reaseguroRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Reaseguro", id));
        Poliza poliza = polizaRepository.findById(request.idPoliza())
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", request.idPoliza()));
        r.setPoliza(poliza);
        r.setRiesgoRetenido(request.riesgoRetenido());
        r.setRiesgoCedido(request.riesgoCedido());
        r.setReaseguradoraAsociada(request.reaseguradoraAsociada());
        return ResponseEntity.ok(ReaseguroResponse.from(reaseguroRepository.save(r)));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Reaseguro r = reaseguroRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Reaseguro", id));
        reaseguroRepository.delete(r);
        return ResponseEntity.noContent().build();
    }
}
