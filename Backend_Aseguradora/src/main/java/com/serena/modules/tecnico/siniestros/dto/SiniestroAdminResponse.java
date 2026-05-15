package com.serena.modules.tecnico.siniestros.dto;

import com.serena.modules.tecnico.siniestros.entity.Siniestro;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SiniestroAdminResponse(
        Integer idSiniestro,
        Integer idPoliza,
        String polizaNombre,
        String polizaTipo,
        Integer idCliente,
        String clienteNombre,
        Integer idEmpleadoAnalista,
        String analistaAsignado,
        String tipoIncidente,
        String descripcion,
        LocalDate fechaOcurrencia,
        LocalDateTime fechaReporte,
        String estadoResolucion,
        BigDecimal montoReclamado,
        String observacionesPerito,
        BigDecimal montoEstimadoPerito,
        String informeTecnico
) {
    public static SiniestroAdminResponse from(Siniestro s) {
        var poliza = s.getPoliza();
        var cliente = poliza.getCliente();
        var clientePersona = cliente.getPersona();
        var analista = s.getEmpleadoAnalista();
        return new SiniestroAdminResponse(
                s.getIdSiniestro(),
                poliza.getIdPoliza(),
                poliza.getProducto().getNombre(),
                poliza.getProducto().getTipoSeguro().name(),
                cliente.getIdCliente(),
                clientePersona.getNombres() + " " + clientePersona.getApellidos(),
                analista != null ? analista.getIdEmpleado() : null,
                analista != null
                        ? analista.getPersona().getNombres() + " " + analista.getPersona().getApellidos()
                        : null,
                s.getTipoIncidente(),
                s.getDescripcion(),
                s.getFechaOcurrencia(),
                s.getFechaReporte(),
                s.getEstadoResolucion().name(),
                s.getMontoReclamado(),
                s.getObservacionesPerito(),
                s.getMontoEstimadoPerito(),
                s.getInformeTecnico()
        );
    }
}
