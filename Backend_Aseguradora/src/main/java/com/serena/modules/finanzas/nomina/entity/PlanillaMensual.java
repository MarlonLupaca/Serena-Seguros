package com.serena.modules.finanzas.nomina.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "planilla_mensual")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanillaMensual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_planilla")
    private Integer idPlanilla;

    @Column(nullable = false, unique = true, length = 7)
    private String periodo;

    @Column(name = "total_planilla", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalPlanilla = BigDecimal.ZERO;

    @Column(name = "total_descuentos", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalDescuentos = BigDecimal.ZERO;

    @Column(name = "total_neto", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalNeto = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.PROCESADA;

    @Column(name = "fecha_proceso", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaProceso;

    public enum Estado {
        PROCESADA, CERRADA
    }
}
