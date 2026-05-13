package com.serena.modules.notificaciones.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.notificaciones.entity.Notificacion;
import com.serena.modules.notificaciones.repository.NotificacionRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionRepository repo;

    public record NotificacionResponse(
            Integer idNotificacion,
            String titulo,
            String mensaje,
            String enlace,
            String tipo,
            Boolean leida,
            LocalDateTime fecha
    ) {
        public static NotificacionResponse from(Notificacion n) {
            return new NotificacionResponse(
                    n.getIdNotificacion(),
                    n.getTitulo(),
                    n.getMensaje(),
                    n.getEnlace(),
                    n.getTipo().name(),
                    n.getLeida(),
                    n.getFecha()
            );
        }
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<NotificacionResponse>> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(repo.findByUsuarioOrderByFechaDesc(usuario)
                .stream().map(NotificacionResponse::from).toList());
    }

    @GetMapping("/conteo")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> conteo(@AuthenticationPrincipal Usuario usuario) {
        Map<String, Object> r = new HashMap<>();
        r.put("no_leidas", repo.countByUsuarioAndLeidaFalse(usuario));
        return ResponseEntity.ok(r);
    }

    @PatchMapping("/{id}/leer")
    @Transactional
    public ResponseEntity<NotificacionResponse> marcarLeida(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        Notificacion n = repo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Notificacion", id));
        if (!n.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccessDeniedException("No es destinatario de esta notificacion");
        }
        n.setLeida(true);
        return ResponseEntity.ok(NotificacionResponse.from(repo.save(n)));
    }

    @PatchMapping("/leer-todas")
    @Transactional
    public ResponseEntity<Map<String, Object>> leerTodas(@AuthenticationPrincipal Usuario usuario) {
        var pendientes = repo.findByUsuarioOrderByFechaDesc(usuario).stream()
                .filter(n -> !Boolean.TRUE.equals(n.getLeida()))
                .toList();
        pendientes.forEach(n -> n.setLeida(true));
        repo.saveAll(pendientes);
        Map<String, Object> r = new HashMap<>();
        r.put("actualizadas", pendientes.size());
        return ResponseEntity.ok(r);
    }
}
