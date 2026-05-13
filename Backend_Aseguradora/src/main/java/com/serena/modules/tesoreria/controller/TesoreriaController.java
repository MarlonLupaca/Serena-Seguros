package com.serena.modules.tesoreria.controller;

import com.serena.modules.tesoreria.entity.FlujoCaja;
import com.serena.modules.tesoreria.repository.FlujoCajaRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tesoreria")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIVO', 'EJECUTIVO')")
public class TesoreriaController {

    private final FlujoCajaRepository repo;

    public record FlujoCajaResponse(
            Integer idMovimiento,
            String tipoFlujo,
            String concepto,
            BigDecimal monto,
            String estadoAprobacion,
            LocalDate fechaProgramada
    ) {
        public static FlujoCajaResponse from(FlujoCaja f) {
            return new FlujoCajaResponse(
                    f.getIdMovimiento(),
                    f.getTipoFlujo().name(),
                    f.getConcepto(),
                    f.getMonto(),
                    f.getEstadoAprobacion().name(),
                    f.getFechaProgramada()
            );
        }
    }

    public record FlujoCajaRequest(
            @NotNull FlujoCaja.TipoFlujo tipoFlujo,
            @NotBlank @Size(max = 150) String concepto,
            @NotNull @DecimalMin("0.00") BigDecimal monto,
            @NotNull LocalDate fechaProgramada,
            FlujoCaja.EstadoAprobacion estadoAprobacion
    ) {}

    public record CambioEstadoRequest(@NotNull FlujoCaja.EstadoAprobacion estadoAprobacion) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<FlujoCajaResponse>> listar(
            @RequestParam(required = false) FlujoCaja.EstadoAprobacion estado
    ) {
        var lista = (estado != null)
                ? repo.findByEstadoAprobacionOrderByFechaProgramadaDesc(estado)
                : repo.findAllByOrderByFechaProgramadaDesc();
        return ResponseEntity.ok(lista.stream().map(FlujoCajaResponse::from).toList());
    }

    @GetMapping("/resumen")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> resumen() {
        var lista = repo.findAll();
        BigDecimal ingresos = lista.stream()
                .filter(f -> f.getTipoFlujo() == FlujoCaja.TipoFlujo.INGRESO)
                .map(FlujoCaja::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal egresos = lista.stream()
                .filter(f -> f.getTipoFlujo() == FlujoCaja.TipoFlujo.EGRESO)
                .map(FlujoCaja::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> resumen = new HashMap<>();
        resumen.put("ingresos", ingresos);
        resumen.put("egresos", egresos);
        resumen.put("balance", ingresos.subtract(egresos));
        resumen.put("total_movimientos", lista.size());
        resumen.put("calculado_en", LocalDateTime.now());
        return ResponseEntity.ok(resumen);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<FlujoCajaResponse> crear(@Valid @RequestBody FlujoCajaRequest request) {
        FlujoCaja f = FlujoCaja.builder()
                .tipoFlujo(request.tipoFlujo())
                .concepto(request.concepto())
                .monto(request.monto())
                .fechaProgramada(request.fechaProgramada())
                .estadoAprobacion(request.estadoAprobacion() != null ? request.estadoAprobacion() : FlujoCaja.EstadoAprobacion.PENDIENTE)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(FlujoCajaResponse.from(repo.save(f)));
    }

    @PatchMapping("/{id}/estado")
    @Transactional
    public ResponseEntity<FlujoCajaResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoRequest request
    ) {
        FlujoCaja f = repo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Movimiento", id));
        f.setEstadoAprobacion(request.estadoAprobacion());
        return ResponseEntity.ok(FlujoCajaResponse.from(repo.save(f)));
    }
}
