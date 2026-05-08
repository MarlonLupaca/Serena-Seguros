package com.serena.modules.ejecutivo.entity;

import com.serena.modules.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "objetivo_corporativo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObjetivoCorporativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_objetivo")
    private Integer idObjetivo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empleado_responsable", nullable = false)
    private Empleado empleadoResponsable;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(name = "meta_cuantitativa", nullable = false, precision = 12, scale = 2)
    private BigDecimal metaCuantitativa;

    @Column(name = "avance_actual", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal avanceActual = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.EN_PROGRESO;

    public enum Estado { CUMPLIDO, EN_RIESGO, RETRASADO, EN_PROGRESO }
}
