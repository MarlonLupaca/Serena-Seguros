package com.serena.modules.comercial.cotizaciones.dto;

import jakarta.validation.constraints.NotNull;

public record AsignarAgenteRequest(

        @NotNull(message = "El id del empleado agente es obligatorio")
        Integer idEmpleadoAgente

) {}
