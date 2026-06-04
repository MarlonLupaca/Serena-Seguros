package com.serena.modules.soporte.ticket.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.ticket.dto.TicketRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final AuditoriaService auditoriaService;
    private final JiraIntegrationService jiraService;

    public Map<String, Object> crearTicket(TicketRequestDTO dto) {
        // 1. Obtener información del usuario autenticado
        Usuario usuario = null;
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof Usuario u) {
                usuario = u;
            }
        } catch (Exception e) {
            log.error("Error al obtener el usuario autenticado: ", e);
        }

        // Validación de justificación para empleados (roles distintos a ASEGURADO)
        if (usuario != null && !usuario.getPortalAcceso().name().equals("ASEGURADO")) {
            if (dto.getJustificacionNegocio() == null || dto.getJustificacionNegocio().isBlank()) {
                throw new IllegalArgumentException("La justificación de negocio es obligatoria para los empleados.");
            }
        }

        // 2. Extraer Nombres y Cargo
        String nombreUsuario = "Usuario Desconocido";
        String areaCargo = "ASEGURADO";
        if (usuario != null) {
            nombreUsuario = usuario.getUsername();
            areaCargo = usuario.getPortalAcceso().name();
        }

        // 3. Registrar en auditoria_accion
        String detalleAuditoria = String.format("Categoría: %s, Asunto: %s, Urgencia: %s, Impacto: %s",
                dto.getCategoria(), dto.getAsunto(), dto.getUrgencia(), dto.getImpacto());
        
        auditoriaService.registrar("REGISTRO_SOLICITUD", "MESA_SERVICIOS", detalleAuditoria);

        // 4. Envío a Jira
        String issueKey = jiraService.createTicket(
                dto.getCategoria(), // 42, 43, 44
                dto.getAsunto(),
                dto.getDescripcion(),
                nombreUsuario,
                areaCargo,
                dto.getJustificacionNegocio(),
                dto.getUrgencia(), // 10021, 10022, 10023
                dto.getImpacto()   // 10001, 10002, 10003
        );

        log.info("Ticket {} creado con éxito en Jira", issueKey);

        // Respuesta exitosa
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Ticket creado en Jira correctamente (Referencia: " + issueKey + ")");
        response.put("ticketId", issueKey);

        return response;
    }


}
