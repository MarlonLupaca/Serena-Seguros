package com.serena.modules.soporte.auditoria.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaWriterService writer;

    public void registrar(String accion, String modulo, String detalle) {
        Integer idUsuario = null;
        String username = null;

        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof Usuario u) {
                idUsuario = u.getIdUsuario();
                username = u.getUsername();
            }
        } catch (Exception ignored) {}

        writer.registrar(idUsuario, username, accion, modulo, detalle);
    }

    public void registrar(Integer idUsuario, String username, String accion, String modulo, String detalle) {
        writer.registrar(idUsuario, username, accion, modulo, detalle);
    }
}