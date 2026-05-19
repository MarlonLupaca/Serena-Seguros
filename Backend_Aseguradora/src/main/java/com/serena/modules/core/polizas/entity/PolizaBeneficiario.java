package com.serena.modules.core.polizas.entity;

import com.serena.modules.seguridad.perfil.entity.Beneficiario;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "poliza_beneficiario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolizaBeneficiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_poliza_beneficiario")
    private Integer idPolizaBeneficiario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_poliza", nullable = false)
    private Poliza poliza;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_beneficiario")
    private Beneficiario beneficiario;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "parentesco", nullable = false, length = 50)
    private String parentesco;

    @Column(name = "documento_identidad", length = 20)
    private String documentoIdentidad;

    @Column(name = "porcentaje", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentaje;
}
