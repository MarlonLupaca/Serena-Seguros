package com.serena.modules.soporte.auditoria.service;

import com.serena.modules.soporte.auditoria.entity.AuditoriaAccion;
import com.serena.modules.soporte.auditoria.repository.AuditoriaRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaRepository repo;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(String accion, String modulo, String detalle) {
        Integer idUsuario = null;
        String username = null;
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof Usuario u) {
                idUsuario = u.getIdUsuario();
                username = u.getUsername();
            }
        } catch (Exception ignored) {
        }
        registrar(idUsuario, username, accion, modulo, detalle);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(Integer idUsuario, String username, String accion, String modulo, String detalle) {
        try {
            repo.save(AuditoriaAccion.builder()
                    .idUsuario(idUsuario)
                    .username(username)
                    .accion(accion)
                    .modulo(modulo)
                    .detalle(detalle)
                    .build());
        } catch (Exception ignored) {
            // la auditoria nunca debe romper el flujo principal
        }
    }
}
