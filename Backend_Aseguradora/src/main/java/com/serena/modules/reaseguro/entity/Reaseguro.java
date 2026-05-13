package com.serena.modules.reaseguro.entity;

import com.serena.modules.polizas.entity.Poliza;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "reaseguro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reaseguro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reaseguro")
    private Integer idReaseguro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_poliza", nullable = false)
    private Poliza poliza;

    @Column(name = "riesgo_retenido", nullable = false, precision = 10, scale = 2)
    private BigDecimal riesgoRetenido;

    @Column(name = "riesgo_cedido", nullable = false, precision = 10, scale = 2)
    private BigDecimal riesgoCedido;

    @Column(name = "reaseguradora_asociada", nullable = false, length = 150)
    private String reaseguradoraAsociada;
}
