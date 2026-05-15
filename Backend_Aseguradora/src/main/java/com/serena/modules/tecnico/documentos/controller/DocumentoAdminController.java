package com.serena.modules.tecnico.documentos.controller;

import com.serena.modules.tecnico.documentos.service.DocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/documentos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO', 'OPERATIVO')")
public class DocumentoAdminController {

    private final DocumentoService documentoService;

    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargar(@PathVariable Integer id) throws IOException {
        DocumentoService.DescargaArchivo d = documentoService.descargarAdmin(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + d.nombreOriginal() + "\"")
                .body(d.resource());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        documentoService.eliminarAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
