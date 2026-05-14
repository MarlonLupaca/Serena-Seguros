package com.serena.modules.finanzas.presupuesto.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "presupuesto_area")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresupuestoArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_presupuesto")
    private Integer idPresupuesto;

    @Column(nullable = false, unique = true, length = 100)
    private String area;

    @Column(name = "presupuesto_asignado", nullable = false, precision = 12, scale = 2)
    private BigDecimal presupuestoAsignado;

    @Column(name = "monto_ejecutado", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal montoEjecutado = BigDecimal.ZERO;

    @Column(name = "alertas_sobreconsumo")
    @Builder.Default
    private Boolean alertasSobreconsumo = false;
}
