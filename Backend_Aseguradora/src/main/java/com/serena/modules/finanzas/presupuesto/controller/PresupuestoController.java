package com.serena.modules.finanzas.presupuesto.controller;

import com.serena.modules.finanzas.presupuesto.entity.PresupuestoArea;
import com.serena.modules.finanzas.presupuesto.repository.PresupuestoAreaRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/presupuestos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class PresupuestoController {

    private final PresupuestoAreaRepository repo;

    public record PresupuestoResponse(
            Integer idPresupuesto,
            String area,
            BigDecimal presupuestoAsignado,
            BigDecimal montoEjecutado,
            BigDecimal disponible,
            Integer porcentajeUso,
            Boolean alertasSobreconsumo
    ) {
        public static PresupuestoResponse from(PresupuestoArea p) {
            BigDecimal disp = p.getPresupuestoAsignado().subtract(p.getMontoEjecutado());
            int pct = p.getPresupuestoAsignado().signum() == 0 ? 0
                    : p.getMontoEjecutado()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(p.getPresupuestoAsignado(), 0, java.math.RoundingMode.HALF_UP)
                        .intValue();
            return new PresupuestoResponse(
                    p.getIdPresupuesto(),
                    p.getArea(),
                    p.getPresupuestoAsignado(),
                    p.getMontoEjecutado(),
                    disp,
                    pct,
                    p.getAlertasSobreconsumo()
            );
        }
    }

    public record PresupuestoRequest(
            @NotBlank @Size(max = 100) String area,
            @NotNull @DecimalMin("0.00") BigDecimal presupuestoAsignado,
            @DecimalMin("0.00") BigDecimal montoEjecutado,
            Boolean alertasSobreconsumo
    ) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<PresupuestoResponse>> listar() {
        return ResponseEntity.ok(
                repo.findAllByOrderByAreaAsc().stream().map(PresupuestoResponse::from).toList()
        );
    }

    @PostMapping
    @Transactional
    public ResponseEntity<PresupuestoResponse> crear(@Valid @RequestBody PresupuestoRequest request) {
        PresupuestoArea p = PresupuestoArea.builder()
                .area(request.area())
                .presupuestoAsignado(request.presupuestoAsignado())
                .montoEjecutado(request.montoEjecutado() != null ? request.montoEjecutado() : BigDecimal.ZERO)
                .alertasSobreconsumo(Boolean.TRUE.equals(request.alertasSobreconsumo()))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(PresupuestoResponse.from(repo.save(p)));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<PresupuestoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PresupuestoRequest request
    ) {
        PresupuestoArea p = repo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Presupuesto", id));
        p.setArea(request.area());
        p.setPresupuestoAsignado(request.presupuestoAsignado());
        if (request.montoEjecutado() != null) p.setMontoEjecutado(request.montoEjecutado());
        if (request.alertasSobreconsumo() != null) p.setAlertasSobreconsumo(request.alertasSobreconsumo());
        return ResponseEntity.ok(PresupuestoResponse.from(repo.save(p)));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        PresupuestoArea p = repo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Presupuesto", id));
        repo.delete(p);
        return ResponseEntity.noContent().build();
    }
}
