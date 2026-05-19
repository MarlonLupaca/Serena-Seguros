package com.serena.modules.comercial.suscripcion.entity;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluacion_riesgo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluacionRiesgo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Integer idEvaluacion;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cotizacion", nullable = false, unique = true)
    private LeadCotizacion cotizacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_seguro", nullable = false)
    private ProductoSeguro.TipoSeguro tipoSeguro;

    @Column(name = "datos_riesgo", nullable = false, columnDefinition = "json")
    private String datosRiesgo;

    @Column(name = "factor_riesgo", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal factorRiesgo = BigDecimal.ONE;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_suscripcion", nullable = false)
    @Builder.Default
    private EstadoSuscripcion estadoSuscripcion = EstadoSuscripcion.PENDIENTE;

    @Column(name = "motivo_rechazo", columnDefinition = "text")
    private String motivoRechazo;

    @Column(name = "fecha_evaluacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaEvaluacion;

    public enum EstadoSuscripcion {
        PENDIENTE, ACEPTADA, RECHAZADA
    }
}
