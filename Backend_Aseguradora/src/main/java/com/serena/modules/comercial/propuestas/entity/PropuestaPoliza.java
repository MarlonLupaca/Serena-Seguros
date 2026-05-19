package com.serena.modules.comercial.propuestas.entity;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "propuesta_poliza")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropuestaPoliza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_propuesta")
    private Integer idPropuesta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cotizacion", nullable = false)
    private LeadCotizacion cotizacion;

    @Column(name = "suma_asegurada", nullable = false, precision = 12, scale = 2)
    private BigDecimal sumaAsegurada;

    @Column(name = "deducible", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deducible = BigDecimal.ZERO;

    @Column(name = "prima_calculada", nullable = false, precision = 10, scale = 2)
    private BigDecimal primaCalculada;

    @Enumerated(EnumType.STRING)
    @Column(name = "frecuencia_pago", nullable = false)
    @Builder.Default
    private FrecuenciaPago frecuenciaPago = FrecuenciaPago.MENSUAL;

    @Column(name = "numero_cuotas", nullable = false)
    @Builder.Default
    private Integer numeroCuotas = 12;

    @Column(name = "coberturas_json", nullable = false, columnDefinition = "json")
    private String coberturasJson;

    @Column(name = "exclusiones_texto", columnDefinition = "text")
    private String exclusionesTexto;

    @Column(name = "vigencia_meses", nullable = false)
    @Builder.Default
    private Integer vigenciaMeses = 12;

    @Column(name = "valida_hasta", nullable = false)
    private LocalDate validaHasta;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @Builder.Default
    private Estado estado = Estado.EMITIDA;

    @Column(name = "fecha_emision", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaEmision;

    @Column(name = "fecha_aceptacion")
    private LocalDateTime fechaAceptacion;

    public enum FrecuenciaPago {
        UNICO, MENSUAL, TRIMESTRAL, ANUAL
    }

    public enum Estado {
        EMITIDA, ACEPTADA, RECHAZADA, EXPIRADA
    }
}
