package com.serena.modules.tecnico.documentos.entity;

import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "documento_auditoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Integer idDocumento;

    @Column(name = "tabla_referencia", nullable = false, length = 50)
    private String tablaReferencia;

    @Column(name = "id_referencia", nullable = false)
    private Integer idReferencia;

    @Column(name = "ruta_archivo", nullable = false, length = 255)
    private String rutaArchivo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_creador", nullable = false)
    private Usuario usuarioCreador;

    @Column(name = "fecha_carga", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCarga;
}
