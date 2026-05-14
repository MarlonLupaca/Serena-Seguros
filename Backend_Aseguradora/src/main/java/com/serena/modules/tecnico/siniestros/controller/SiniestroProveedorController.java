package com.serena.modules.tecnico.siniestros.controller;

import com.serena.modules.tecnico.proveedores.entity.ProveedorRed;
import com.serena.modules.tecnico.proveedores.repository.ProveedorRedRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.entity.SiniestroProveedor;
import com.serena.modules.tecnico.siniestros.repository.SiniestroProveedorRepository;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/siniestros/{idSiniestro}/proveedores")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public class SiniestroProveedorController {

    private final SiniestroProveedorRepository asignacionRepo;
    private final SiniestroRepository siniestroRepo;
    private final ProveedorRedRepository proveedorRepo;

    public record AsignacionResponse(
            Integer idProveedor,
            String nombre,
            String rubro,
            String ciudad,
            BigDecimal costoServicio,
            LocalDateTime fechaAsignacion
    ) {
        public static AsignacionResponse from(SiniestroProveedor sp) {
            ProveedorRed prov = sp.getProveedor();
            return new AsignacionResponse(
                    prov.getIdProveedor(),
                    prov.getNombre(),
                    prov.getRubro().name(),
                    prov.getCiudad(),
                    sp.getCostoServicio(),
                    sp.getFechaAsignacion()
            );
        }
    }

    public record AsignacionRequest(
            @NotNull Integer idProveedor,
            @NotNull @DecimalMin("0.00") BigDecimal costoServicio
    ) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AsignacionResponse>> listar(@PathVariable Integer idSiniestro) {
        Siniestro siniestro = siniestroRepo.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        return ResponseEntity.ok(asignacionRepo.findBySiniestroOrderByFechaAsignacionDesc(siniestro)
                .stream().map(AsignacionResponse::from).toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<AsignacionResponse> asignar(
            @PathVariable Integer idSiniestro,
            @Valid @RequestBody AsignacionRequest request
    ) {
        Siniestro siniestro = siniestroRepo.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        ProveedorRed proveedor = proveedorRepo.findById(request.idProveedor())
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor", request.idProveedor()));

        SiniestroProveedor.SiniestroProveedorId pk = SiniestroProveedor.SiniestroProveedorId.builder()
                .idSiniestro(idSiniestro)
                .idProveedor(request.idProveedor())
                .build();

        SiniestroProveedor sp = SiniestroProveedor.builder()
                .id(pk)
                .siniestro(siniestro)
                .proveedor(proveedor)
                .costoServicio(request.costoServicio())
                .fechaAsignacion(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(AsignacionResponse.from(asignacionRepo.save(sp)));
    }

    @DeleteMapping("/{idProveedor}")
    @Transactional
    public ResponseEntity<Void> quitar(
            @PathVariable Integer idSiniestro,
            @PathVariable Integer idProveedor
    ) {
        SiniestroProveedor.SiniestroProveedorId pk = SiniestroProveedor.SiniestroProveedorId.builder()
                .idSiniestro(idSiniestro)
                .idProveedor(idProveedor)
                .build();
        if (!asignacionRepo.existsById(pk)) {
            throw new RecursoNoEncontradoException("Asignacion", idProveedor);
        }
        asignacionRepo.deleteById(pk);
        return ResponseEntity.noContent().build();
    }
}
