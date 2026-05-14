package com.serena.modules.ejecutivo.controller;

import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.ejecutivo.entity.AprobacionCritica;
import com.serena.modules.ejecutivo.repository.AprobacionCriticaRepository;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
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
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/aprobaciones")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EJECUTIVO')")
public class AprobacionController {

    private final AprobacionCriticaRepository repo;
    private final AuditoriaService auditoria;
    private final NotificacionService notificaciones;

    public record AprobacionResponse(
            Integer idAprobacion,
            String moduloOrigen,
            BigDecimal montoImpacto,
            String comentariosPrevios,
            String estadoGerencial,
            LocalDateTime fechaSolicitud
    ) {
        public static AprobacionResponse from(AprobacionCritica a) {
            return new AprobacionResponse(
                    a.getIdAprobacion(),
                    a.getModuloOrigen(),
                    a.getMontoImpacto(),
                    a.getComentariosPrevios(),
                    a.getEstadoGerencial().name(),
                    a.getFechaSolicitud()
            );
        }
    }

    public record AprobacionRequest(
            @NotBlank @Size(max = 100) String moduloOrigen,
            @NotNull @DecimalMin("0.00") BigDecimal montoImpacto,
            @Size(max = 2000) String comentariosPrevios
    ) {}

    public record CambioEstadoRequest(@NotNull AprobacionCritica.EstadoGerencial estadoGerencial) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AprobacionResponse>> listar(
            @RequestParam(required = false) AprobacionCritica.EstadoGerencial estado
    ) {
        var lista = (estado != null)
                ? repo.findByEstadoGerencialOrderByFechaSolicitudDesc(estado)
                : repo.findAllByOrderByFechaSolicitudDesc();
        return ResponseEntity.ok(lista.stream().map(AprobacionResponse::from).toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<AprobacionResponse> crear(@Valid @RequestBody AprobacionRequest request) {
        AprobacionCritica a = AprobacionCritica.builder()
                .moduloOrigen(request.moduloOrigen())
                .montoImpacto(request.montoImpacto())
                .comentariosPrevios(request.comentariosPrevios())
                .estadoGerencial(AprobacionCritica.EstadoGerencial.PENDIENTE)
                .fechaSolicitud(LocalDateTime.now())
                .build();
        AprobacionCritica saved = repo.save(a);
        notificaciones.crearParaPortal(Usuario.PortalAcceso.EJECUTIVO,
                Notificacion.Tipo.APROBACION,
                "Nueva aprobacion - " + saved.getModuloOrigen(),
                "Monto: " + saved.getMontoImpacto() + ". " + (saved.getComentariosPrevios() == null ? "" : saved.getComentariosPrevios()),
                "/ejecutivo/aprobaciones");
        return ResponseEntity.status(HttpStatus.CREATED).body(AprobacionResponse.from(saved));
    }

    @PatchMapping("/{id}/estado")
    @Transactional
    public ResponseEntity<AprobacionResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoRequest request
    ) {
        AprobacionCritica a = repo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Aprobacion", id));
        a.setEstadoGerencial(request.estadoGerencial());
        auditoria.registrar("aprobacion_" + request.estadoGerencial().name().toLowerCase(),
                "aprobaciones", "Aprobacion #" + id + " - modulo " + a.getModuloOrigen()
                        + " - monto " + a.getMontoImpacto());
        return ResponseEntity.ok(AprobacionResponse.from(repo.save(a)));
    }
}
