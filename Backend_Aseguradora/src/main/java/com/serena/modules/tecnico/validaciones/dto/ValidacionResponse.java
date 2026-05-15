package com.serena.modules.tecnico.validaciones.dto;

import com.serena.modules.tecnico.validaciones.entity.ValidacionDocumental;

import java.time.LocalDateTime;

public record ValidacionResponse(
        Integer idValidacion,
        Integer idCliente,
        String clienteNombre,
        String clienteDocumento,
        String clienteEmail,
        String clienteTelefono,
        Integer idDocumento,
        String estado,
        String motivoRechazo,
        Integer idEmpleadoValidador,
        String validadorNombre,
        LocalDateTime fechaIngreso,
        LocalDateTime fechaResolucion
) {
    public static ValidacionResponse from(ValidacionDocumental v) {
        var cliente = v.getCliente();
        var persona = cliente.getPersona();
        var validador = v.getEmpleadoValidador();
        return new ValidacionResponse(
                v.getIdValidacion(),
                cliente.getIdCliente(),
                persona.getNombres() + " " + persona.getApellidos(),
                persona.getDocumentoIdentidad(),
                persona.getEmail(),
                persona.getTelefono(),
                v.getDocumento() != null ? v.getDocumento().getIdDocumento() : null,
                v.getEstado().name(),
                v.getMotivoRechazo(),
                validador != null ? validador.getIdEmpleado() : null,
                validador != null
                        ? validador.getPersona().getNombres() + " " + validador.getPersona().getApellidos()
                        : null,
                v.getFechaIngreso(),
                v.getFechaResolucion()
        );
    }
}
