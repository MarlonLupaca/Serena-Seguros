package com.serena.modules.soporte.auditoria.service;

import com.serena.modules.soporte.auditoria.entity.AuditoriaAccion;
import com.serena.modules.soporte.auditoria.repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditoriaWriterService {

    private final AuditoriaRepository repo;

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
            // nunca romper flujo principal
        }
    }
}