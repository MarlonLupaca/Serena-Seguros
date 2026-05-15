package com.serena.modules.seguridad.clientes.dto;

import com.serena.modules.seguridad.clientes.entity.NotaCliente;

import java.time.LocalDateTime;

public record NotaClienteResponse(
        Integer idNota,
        String texto,
        String autor,
        LocalDateTime fecha
) {
    public static NotaClienteResponse from(NotaCliente n) {
        String autor = null;
        if (n.getEmpleadoAutor() != null && n.getEmpleadoAutor().getPersona() != null) {
            var p = n.getEmpleadoAutor().getPersona();
            autor = p.getNombres() + " " + p.getApellidos();
        }
        return new NotaClienteResponse(n.getIdNota(), n.getTexto(), autor, n.getFecha());
    }
}
