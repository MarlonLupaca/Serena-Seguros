package com.serena.modules.soporte.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketRequestDTO {

    @NotBlank(message = "La categoría es obligatoria")
    private String categoria;

    @NotBlank(message = "El asunto es obligatorio")
    private String asunto;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    // La justificación puede ser opcional dependiendo del rol,
    // la validación se puede hacer a nivel de servicio.
    private String justificacionNegocio;

    @NotBlank(message = "La urgencia es obligatoria")
    private String urgencia;

    @NotBlank(message = "El impacto es obligatorio")
    private String impacto;
}
