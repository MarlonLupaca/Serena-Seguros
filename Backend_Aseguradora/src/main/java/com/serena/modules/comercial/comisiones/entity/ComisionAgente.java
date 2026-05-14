package com.serena.modules.comercial.comisiones.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.core.polizas.entity.Poliza;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "comision_agente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComisionAgente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comision")
    private Integer idComision;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empleado_agente", nullable = false)
    private Empleado empleadoAgente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_poliza", nullable = false)
    private Poliza poliza;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentaje;

    @Column(name = "monto_generado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoGenerado;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false)
    @Builder.Default
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    public enum EstadoPago {
        PENDIENTE, PAGADA
    }
}
