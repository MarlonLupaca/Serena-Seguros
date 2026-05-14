package com.serena.modules.tecnico.documentos.dto;

import com.serena.modules.tecnico.documentos.entity.DocumentoAuditoria;

import java.time.LocalDateTime;

public record DocumentoResponse(
        Integer idDocumento,
        String tablaReferencia,
        Integer idReferencia,
        String nombreArchivo,
        LocalDateTime fechaCarga
) {
    public static DocumentoResponse from(DocumentoAuditoria d) {
        String ruta = d.getRutaArchivo();
        String nombre = ruta != null && ruta.contains("_")
                ? ruta.substring(ruta.indexOf('_') + 1)
                : ruta;
        return new DocumentoResponse(
                d.getIdDocumento(),
                d.getTablaReferencia(),
                d.getIdReferencia(),
                nombre,
                d.getFechaCarga()
        );
    }
}
