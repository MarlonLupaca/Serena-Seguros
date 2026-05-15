package com.serena.modules.seguridad.perfil.entity;

import com.serena.modules.seguridad.auth.entity.Persona;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "beneficiario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_beneficiario")
    private Integer idBeneficiario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_persona", nullable = false)
    private Persona persona;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 50)
    private String parentesco;

    @Column(name = "documento_identidad", length = 20)
    private String documentoIdentidad;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal porcentaje = new BigDecimal("100.00");
}
