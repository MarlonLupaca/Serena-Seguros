package com.serena.modules.soporte.notificaciones.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository repo;
    private final UsuarioRepository usuarioRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void crear(Usuario destinatario, Notificacion.Tipo tipo, String titulo, String mensaje, String enlace) {
        if (destinatario == null) return;
        try {
            repo.save(Notificacion.builder()
                    .usuario(destinatario)
                    .titulo(titulo)
                    .mensaje(mensaje)
                    .enlace(enlace)
                    .tipo(tipo)
                    .leida(false)
                    .build());
        } catch (Exception ignored) {
            // las notificaciones nunca rompen el flujo principal
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void crearParaPortal(Usuario.PortalAcceso portal, Notificacion.Tipo tipo, String titulo, String mensaje, String enlace) {
        try {
            List<Usuario> destinatarios = usuarioRepository.findByPortalAccesoAndEstado(portal, Usuario.Estado.ACTIVO);
            for (Usuario u : destinatarios) {
                crear(u, tipo, titulo, mensaje, enlace);
            }
        } catch (Exception ignored) {
        }
    }
}
