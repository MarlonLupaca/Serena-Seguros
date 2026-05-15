package com.serena.modules.finanzas.compras.dto;

import com.serena.modules.finanzas.compras.entity.SolicitudCompra;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SolicitudCompraResponse(
        Integer idSolicitud,
        String area,
        String producto,
        String descripcion,
        BigDecimal montoEstimado,
        String prioridad,
        String estado,
        Integer idEmpleadoSolicitante,
        String solicitanteNombre,
        LocalDateTime fechaSolicitud
) {
    public static SolicitudCompraResponse from(SolicitudCompra s) {
        var emp = s.getEmpleadoSolicitante();
        String nombre = null;
        if (emp != null && emp.getPersona() != null) {
            nombre = emp.getPersona().getNombres() + " " + emp.getPersona().getApellidos();
        }
        return new SolicitudCompraResponse(
                s.getIdSolicitud(),
                s.getArea(),
                s.getProducto(),
                s.getDescripcion(),
                s.getMontoEstimado(),
                s.getPrioridad().name(),
                s.getEstado().name(),
                emp != null ? emp.getIdEmpleado() : null,
                nombre,
                s.getFechaSolicitud()
        );
    }
}
