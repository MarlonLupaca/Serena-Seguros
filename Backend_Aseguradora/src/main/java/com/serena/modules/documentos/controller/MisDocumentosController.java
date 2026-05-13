package com.serena.modules.documentos.controller;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.documentos.dto.DocumentoResponse;
import com.serena.modules.documentos.service.DocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mis-documentos")
@RequiredArgsConstructor
public class MisDocumentosController {

    private final DocumentoService documentoService;

    @GetMapping
    public ResponseEntity<List<DocumentoResponse>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) String tabla
    ) {
        return ResponseEntity.ok(documentoService.listar(usuario, tabla));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoResponse> subir(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam(value = "tabla_referencia", required = false) String tablaReferencia,
            @RequestParam(value = "id_referencia", required = false) Integer idReferencia
    ) throws IOException {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(documentoService.subir(usuario, tablaReferencia, idReferencia, archivo));
    }

    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) throws IOException {
        DocumentoService.DescargaArchivo d = documentoService.descargar(usuario, id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + d.nombreOriginal() + "\"")
                .body(d.resource());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id
    ) {
        documentoService.eliminar(usuario, id);
        return ResponseEntity.noContent().build();
    }
}
