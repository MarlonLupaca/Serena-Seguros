package com.serena.modules.core.polizas.entity;

import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "poliza")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Poliza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_poliza")
    private Integer idPoliza;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_producto", nullable = false)
    private ProductoSeguro producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_propuesta")
    private PropuestaPoliza propuesta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_poliza_padre")
    private Poliza polizaPadre;

    @Column(name = "prima_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal primaTotal;

    @Column(name = "suma_asegurada", precision = 12, scale = 2)
    private BigDecimal sumaAsegurada;

    @Column(name = "deducible", precision = 10, scale = 2)
    private BigDecimal deducible;

    @Enumerated(EnumType.STRING)
    @Column(name = "frecuencia_pago")
    private FrecuenciaPago frecuenciaPago;

    @Column(name = "numero_cuotas")
    private Integer numeroCuotas;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_poliza", nullable = false)
    @Builder.Default
    private EstadoPoliza estadoPoliza = EstadoPoliza.PENDIENTE;

    @Column(name = "vigencia_inicio", nullable = false)
    private LocalDate vigenciaInicio;

    @Column(name = "vigencia_fin", nullable = false)
    private LocalDate vigenciaFin;

    @Column(name = "fecha_emision", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaEmision;

    public enum EstadoPoliza {
        ACTIVA, PENDIENTE, VENCIDA, CANCELADA
    }

    public enum FrecuenciaPago {
        UNICO, MENSUAL, TRIMESTRAL, ANUAL
    }
}
