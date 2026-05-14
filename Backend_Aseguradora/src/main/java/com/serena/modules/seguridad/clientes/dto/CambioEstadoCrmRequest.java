package com.serena.modules.seguridad.clientes.dto;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoCrmRequest(

        @NotNull(message = "El estado CRM es obligatorio")
        Cliente.EstadoCrm estadoCrm

) {}
