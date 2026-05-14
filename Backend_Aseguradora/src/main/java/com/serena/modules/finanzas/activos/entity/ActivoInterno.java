package com.serena.modules.finanzas.activos.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "activo_interno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivoInterno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activo")
    private Integer idActivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado_asignado")
    private Empleado empleadoAsignado;

    @Column(nullable = false, length = 100)
    private String tipo;

    @Column(nullable = false, length = 100)
    private String marca;

    @Column(name = "valor_depreciacion", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDepreciacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.OPERATIVO;

    public enum Estado {
        OPERATIVO, MANTENIMIENTO, BAJA
    }
}
