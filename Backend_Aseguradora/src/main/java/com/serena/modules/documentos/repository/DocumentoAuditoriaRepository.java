package com.serena.modules.documentos.repository;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.documentos.entity.DocumentoAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoAuditoriaRepository
        extends JpaRepository<DocumentoAuditoria, Integer> {

    List<DocumentoAuditoria> findByUsuarioCreadorOrderByFechaCargaDesc(Usuario usuario);

    List<DocumentoAuditoria> findByUsuarioCreadorAndTablaReferenciaOrderByFechaCargaDesc(
            Usuario usuario, String tabla
    );
}
