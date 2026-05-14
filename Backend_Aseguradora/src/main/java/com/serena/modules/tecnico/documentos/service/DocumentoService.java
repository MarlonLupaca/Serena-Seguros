package com.serena.modules.tecnico.documentos.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.tecnico.documentos.dto.DocumentoResponse;
import com.serena.modules.tecnico.documentos.entity.DocumentoAuditoria;
import com.serena.modules.tecnico.documentos.repository.DocumentoAuditoriaRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentoService {

    private final DocumentoAuditoriaRepository repository;
    private final DocumentoStorage storage;

    @Transactional(readOnly = true)
    public List<DocumentoResponse> listar(Usuario usuario, String tabla) {
        List<DocumentoAuditoria> docs = (tabla != null && !tabla.isBlank())
                ? repository.findByUsuarioCreadorAndTablaReferenciaOrderByFechaCargaDesc(usuario, tabla)
                : repository.findByUsuarioCreadorOrderByFechaCargaDesc(usuario);
        return docs.stream().map(DocumentoResponse::from).toList();
    }

    @Transactional
    public DocumentoResponse subir(Usuario usuario,
                                   String tablaReferencia,
                                   Integer idReferencia,
                                   MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo es obligatorio");
        }
        String ruta = storage.guardar(archivo);
        DocumentoAuditoria d = DocumentoAuditoria.builder()
                .tablaReferencia(tablaReferencia != null ? tablaReferencia : "general")
                .idReferencia(idReferencia != null ? idReferencia : 0)
                .rutaArchivo(ruta)
                .usuarioCreador(usuario)
                .build();
        return DocumentoResponse.from(repository.save(d));
    }

    @Transactional(readOnly = true)
    public DescargaArchivo descargar(Usuario usuario, Integer id) throws IOException {
        DocumentoAuditoria d = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Documento", id));
        if (!d.getUsuarioCreador().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccessDeniedException("El documento no pertenece al usuario");
        }
        Resource resource = storage.leer(d.getRutaArchivo());
        if (!resource.exists() || !resource.isReadable()) {
            throw new RecursoNoEncontradoException("Archivo fisico", id);
        }
        String nombreOriginal = d.getRutaArchivo();
        if (nombreOriginal.contains("_")) {
            nombreOriginal = nombreOriginal.substring(nombreOriginal.indexOf('_') + 1);
        }
        return new DescargaArchivo(resource, nombreOriginal);
    }

    @Transactional
    public void eliminar(Usuario usuario, Integer id) {
        DocumentoAuditoria d = repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Documento", id));
        if (!d.getUsuarioCreador().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccessDeniedException("El documento no pertenece al usuario");
        }
        repository.delete(d);
    }

    public record DescargaArchivo(Resource resource, String nombreOriginal) {}
}
