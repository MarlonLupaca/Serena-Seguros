package com.serena.modules.finanzas.cuotas.entity;

import com.serena.modules.core.polizas.entity.Poliza;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cuota_cobranza")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuota")
    private Integer idCuota;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_poliza", nullable = false)
    private Poliza poliza;

    @Column(name = "numero_cuota", nullable = false)
    private Integer numeroCuota;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false)
    @Builder.Default
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    public enum EstadoPago {
        PENDIENTE, PAGADO, VENCIDO
    }
}
