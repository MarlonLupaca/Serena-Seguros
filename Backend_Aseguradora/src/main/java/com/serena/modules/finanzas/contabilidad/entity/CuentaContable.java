package com.serena.modules.finanzas.contabilidad.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cuenta_contable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaContable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuenta")
    private Integer idCuenta;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    public enum Tipo {
        ACTIVO, PASIVO, PATRIMONIO, INGRESO, GASTO
    }
}
