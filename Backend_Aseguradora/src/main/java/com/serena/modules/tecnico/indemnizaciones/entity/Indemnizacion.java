package com.serena.modules.tecnico.indemnizaciones.entity;

import com.serena.modules.core.polizas.entity.PolizaBeneficiario;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "indemnizacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Indemnizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_indemnizacion")
    private Integer idIndemnizacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_siniestro", nullable = false)
    private Siniestro siniestro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_poliza_beneficiario")
    private PolizaBeneficiario polizaBeneficiario;

    @Column(name = "monto_aprobado", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoAprobado;

    @Column(name = "monto_pagado", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "medio_pago", nullable = false)
    @Builder.Default
    private MedioPago medioPago = MedioPago.TRANSFERENCIA;

    @Column(name = "fecha_aprobacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaAprobacion;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "observaciones", columnDefinition = "text")
    private String observaciones;

    public enum MedioPago {
        TRANSFERENCIA, CHEQUE, REPARACION_DIRECTA, OTRO
    }
}
