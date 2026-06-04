package com.serena.modules.soporte.ticket.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicketResponseDTO {
    private String ticketId;   // ej. "HELP-18"
    private String asunto;     // ej. "Prueba desde mi sistema"
    private String estado;     // ej. "PENDIENTE_APROBACION"
    private String fecha;      // ej. "2026-06-04T01:58:38.747-0500"
}
