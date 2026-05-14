package com.serena.modules.ejecutivo.controller;

import com.serena.modules.ejecutivo.entity.ObjetivoCorporativo;
import com.serena.modules.ejecutivo.repository.ObjetivoCorporativoRepository;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
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
import java.math.RoundingMode;
import java.util.List;

@RestController
@RequestMapping("/api/v1/objetivos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EJECUTIVO')")
public class ObjetivoController {

    private final ObjetivoCorporativoRepository repo;
    private final EmpleadoRepository empleadoRepo;

    public record ObjetivoResponse(
            Integer idObjetivo,
            Integer idEmpleadoResponsable,
            String empleadoResponsable,
            String descripcion,
            BigDecimal metaCuantitativa,
            BigDecimal avanceActual,
            BigDecimal porcentajeAvance,
            String estado
    ) {
        public static ObjetivoResponse from(ObjetivoCorporativo o) {
            String nombre = "(sin asignar)";
            if (o.getEmpleadoResponsable() != null && o.getEmpleadoResponsable().getPersona() != null) {
                var p = o.getEmpleadoResponsable().getPersona();
                nombre = p.getNombres() + " " + p.getApellidos();
            }
            BigDecimal porcentaje = BigDecimal.ZERO;
            if (o.getMetaCuantitativa() != null && o.getMetaCuantitativa().compareTo(BigDecimal.ZERO) > 0) {
                porcentaje = o.getAvanceActual()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(o.getMetaCuantitativa(), 1, RoundingMode.HALF_UP);
            }
            return new ObjetivoResponse(
                    o.getIdObjetivo(),
                    o.getEmpleadoResponsable() != null ? o.getEmpleadoResponsable().getIdEmpleado() : null,
                    nombre,
                    o.getDescripcion(),
                    o.getMetaCuantitativa(),
                    o.getAvanceActual(),
                    porcentaje,
                    o.getEstado().name()
            );
        }
    }

    public record ObjetivoRequest(
            @NotNull Integer idEmpleadoResponsable,
            @NotBlank @Size(max = 255) String descripcion,
            @NotNull @DecimalMin("0.01") BigDecimal metaCuantitativa,
            @DecimalMin("0.00") BigDecimal avanceActual,
            ObjetivoCorporativo.Estado estado
    ) {}

    public record AvanceRequest(
            @NotNull @DecimalMin("0.00") BigDecimal avanceActual,
            ObjetivoCorporativo.Estado estado
    ) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ObjetivoResponse>> listar(
            @RequestParam(required = false) ObjetivoCorporativo.Estado estado
    ) {
        var lista = (estado != null)
                ? repo.findByEstadoOrderByIdObjetivoDesc(estado)
                : repo.findAllByOrderByIdObjetivoDesc();
        return ResponseEntity.ok(lista.stream().map(ObjetivoResponse::from).toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ObjetivoResponse> crear(@Valid @RequestBody ObjetivoRequest request) {
        var empleado = empleadoRepo.findById(request.idEmpleadoResponsable())
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado", request.idEmpleadoResponsable()));
        ObjetivoCorporativo o = ObjetivoCorporativo.builder()
                .empleadoResponsable(empleado)
                .descripcion(request.descripcion())
                .metaCuantitativa(request.metaCuantitativa())
                .avanceActual(request.avanceActual() != null ? request.avanceActual() : BigDecimal.ZERO)
                .estado(request.estado() != null ? request.estado() : ObjetivoCorporativo.Estado.EN_PROGRESO)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(ObjetivoResponse.from(repo.save(o)));
    }

    @PatchMapping("/{id}/avance")
    @Transactional
    public ResponseEntity<ObjetivoResponse> registrarAvance(
            @PathVariable Integer id,
            @Valid @RequestBody AvanceRequest request
    ) {
        var o = repo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Objetivo", id));
        o.setAvanceActual(request.avanceActual());
        if (request.estado() != null) {
            o.setEstado(request.estado());
        }
        return ResponseEntity.ok(ObjetivoResponse.from(repo.save(o)));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!repo.existsById(id)) {
            throw new RecursoNoEncontradoException("Objetivo", id);
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
