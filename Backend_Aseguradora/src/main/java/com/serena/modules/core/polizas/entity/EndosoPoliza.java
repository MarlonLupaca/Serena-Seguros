package com.serena.modules.core.polizas.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "endoso_poliza")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndosoPoliza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endoso")
    private Integer idEndoso;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_poliza", nullable = false)
    private Poliza poliza;

    @Column(name = "tipo_cambio", nullable = false, length = 100)
    private String tipoCambio;

    @Column(name = "descripcion_cambio", nullable = false, columnDefinition = "TEXT")
    private String descripcionCambio;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_aprobacion", nullable = false)
    @Builder.Default
    private EstadoAprobacion estadoAprobacion = EstadoAprobacion.PENDIENTE;

    @Column(name = "fecha_solicitud", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaSolicitud;

    public enum EstadoAprobacion {
        PENDIENTE, APROBADO, RECHAZADO
    }
}
