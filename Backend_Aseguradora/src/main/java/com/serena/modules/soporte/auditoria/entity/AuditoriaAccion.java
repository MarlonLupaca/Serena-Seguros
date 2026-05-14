package com.serena.modules.soporte.auditoria.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_accion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditoriaAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Integer idAuditoria;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(length = 50)
    private String username;

    @Column(nullable = false, length = 80)
    private String accion;

    @Column(nullable = false, length = 50)
    private String modulo;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fecha;
}
