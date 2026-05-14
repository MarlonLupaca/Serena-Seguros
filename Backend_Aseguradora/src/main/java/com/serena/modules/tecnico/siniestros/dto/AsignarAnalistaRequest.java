package com.serena.modules.tecnico.siniestros.dto;

import jakarta.validation.constraints.NotNull;

public record AsignarAnalistaRequest(

        @NotNull(message = "El id del analista es obligatorio")
        Integer idEmpleadoAnalista

) {}
