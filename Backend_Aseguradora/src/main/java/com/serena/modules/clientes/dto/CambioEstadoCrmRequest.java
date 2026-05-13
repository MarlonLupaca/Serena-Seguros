package com.serena.modules.clientes.dto;

import com.serena.modules.clientes.entity.Cliente;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoCrmRequest(

        @NotNull(message = "El estado CRM es obligatorio")
        Cliente.EstadoCrm estadoCrm

) {}
