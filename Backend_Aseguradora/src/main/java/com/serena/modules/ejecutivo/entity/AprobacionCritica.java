package com.serena.modules.ejecutivo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "aprobacion_critica")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AprobacionCritica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aprobacion")
    private Integer idAprobacion;

    @Column(name = "modulo_origen", nullable = false, length = 100)
    private String moduloOrigen;

    @Column(name = "monto_impacto", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoImpacto;

    @Column(name = "comentarios_previos", columnDefinition = "TEXT")
    private String comentariosPrevios;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_gerencial", nullable = false)
    @Builder.Default
    private EstadoGerencial estadoGerencial = EstadoGerencial.PENDIENTE;

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;

    public enum EstadoGerencial { PENDIENTE, APROBADO, RECHAZADO }
}
