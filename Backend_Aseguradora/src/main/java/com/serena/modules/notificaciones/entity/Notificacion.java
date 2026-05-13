package com.serena.modules.notificaciones.entity;

import com.serena.modules.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Integer idNotificacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Column(length = 255)
    private String enlace;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Tipo tipo = Tipo.GENERAL;

    @Column(nullable = false)
    @Builder.Default
    private Boolean leida = false;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fecha;

    public enum Tipo { APROBACION, SINIESTRO, COBRANZA, COMISION, GENERAL }
}
