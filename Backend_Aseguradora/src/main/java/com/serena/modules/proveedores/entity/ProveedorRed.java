package com.serena.modules.proveedores.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "proveedor_red")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProveedorRed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Integer idProveedor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rubro rubro;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String ciudad;

    @Column(name = "rating_interno", precision = 3, scale = 2)
    private BigDecimal ratingInterno;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.ACTIVO;

    public enum Rubro {
        CLINICA, TALLER, GRUA, ABOGADO, OTROS
    }

    public enum Estado {
        ACTIVO, SUSPENDIDO
    }
}
