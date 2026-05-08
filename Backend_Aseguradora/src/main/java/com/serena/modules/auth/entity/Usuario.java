package com.serena.modules.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "portal_acceso", nullable = false)
    private PortalAcceso portalAcceso;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.ACTIVO;

    public enum PortalAcceso {
        ASEGURADO, COMERCIAL, TECNICO, OPERATIVO, EJECUTIVO
    }

    public enum Estado {
        ACTIVO, INACTIVO, BLOQUEADO
    }
}
