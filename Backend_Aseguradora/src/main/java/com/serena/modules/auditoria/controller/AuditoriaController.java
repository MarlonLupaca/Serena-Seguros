package com.serena.modules.auditoria.controller;

import com.serena.modules.auditoria.entity.AuditoriaAccion;
import com.serena.modules.auditoria.repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auditoria")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EJECUTIVO')")
public class AuditoriaController {

    private final AuditoriaRepository repo;

    public record AuditoriaResponse(
            Integer idAuditoria,
            Integer idUsuario,
            String username,
            String accion,
            String modulo,
            String detalle,
            LocalDateTime fecha
    ) {
        public static AuditoriaResponse from(AuditoriaAccion a) {
            return new AuditoriaResponse(
                    a.getIdAuditoria(),
                    a.getIdUsuario(),
                    a.getUsername(),
                    a.getAccion(),
                    a.getModulo(),
                    a.getDetalle(),
                    a.getFecha()
            );
        }
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AuditoriaResponse>> listar(
            @RequestParam(required = false) String modulo,
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "100") int limite
    ) {
        var paginacion = PageRequest.of(0, Math.min(Math.max(limite, 1), 500));
        List<AuditoriaAccion> data;
        if (modulo != null && !modulo.isBlank()) {
            data = repo.findByModuloOrderByFechaDesc(modulo, paginacion);
        } else if (username != null && !username.isBlank()) {
            data = repo.findByUsernameOrderByFechaDesc(username, paginacion);
        } else {
            data = repo.findAllByOrderByFechaDesc(paginacion);
        }
        return ResponseEntity.ok(data.stream().map(AuditoriaResponse::from).toList());
    }
}
