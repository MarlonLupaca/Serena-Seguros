package com.serena.modules.seguridad.clientes.dto;

import com.serena.modules.seguridad.clientes.entity.Cliente;

import java.time.LocalDateTime;

public record ClienteResponse(
        Integer idCliente,
        Integer idPersona,
        String nombres,
        String apellidos,
        String documentoIdentidad,
        String email,
        String telefono,
        String estadoCrm,
        LocalDateTime fechaRegistro
) {
    public static ClienteResponse from(Cliente c) {
        var persona = c.getPersona();
        return new ClienteResponse(
                c.getIdCliente(),
                persona.getIdPersona(),
                persona.getNombres(),
                persona.getApellidos(),
                persona.getDocumentoIdentidad(),
                persona.getEmail(),
                persona.getTelefono(),
                c.getEstadoCrm().name(),
                c.getFechaRegistro()
        );
    }
}
