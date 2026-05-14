package com.serena.modules.finanzas.tesoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "flujo_caja_tesoreria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlujoCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Integer idMovimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_flujo", nullable = false)
    private TipoFlujo tipoFlujo;

    @Column(nullable = false, length = 150)
    private String concepto;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_aprobacion", nullable = false)
    @Builder.Default
    private EstadoAprobacion estadoAprobacion = EstadoAprobacion.PENDIENTE;

    @Column(name = "fecha_programada", nullable = false)
    private LocalDate fechaProgramada;

    public enum TipoFlujo { INGRESO, EGRESO }
    public enum EstadoAprobacion { PENDIENTE, APROBADO, EJECUTADO }
}
