package com.serena.modules.finanzas.contabilidad.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "asiento_contable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsientoContable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asiento")
    private Integer idAsiento;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(name = "total_debe", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalDebe = BigDecimal.ZERO;

    @Column(name = "total_haber", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalHaber = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.ABIERTO;

    public enum Estado {
        ABIERTO, CERRADO
    }
}
