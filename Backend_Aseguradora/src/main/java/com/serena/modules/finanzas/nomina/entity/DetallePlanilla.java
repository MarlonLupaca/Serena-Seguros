package com.serena.modules.finanzas.nomina.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "detalle_planilla")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePlanilla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_planilla", nullable = false)
    private PlanillaMensual planilla;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empleado", nullable = false)
    private Empleado empleado;

    @Column(name = "sueldo_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal sueldoBase;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal bonos = BigDecimal.ZERO;

    @Column(name = "horas_extra", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal horasExtra = BigDecimal.ZERO;

    @Column(name = "afp_onp", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal afpOnp = BigDecimal.ZERO;

    @Column(name = "impuesto_renta", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal impuestoRenta = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal neto = BigDecimal.ZERO;
}
