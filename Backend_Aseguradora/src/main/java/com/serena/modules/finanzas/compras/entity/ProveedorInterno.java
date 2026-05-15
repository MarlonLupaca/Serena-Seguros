package com.serena.modules.finanzas.compras.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proveedor_interno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProveedorInterno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor_interno")
    private Integer idProveedorInterno;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, unique = true, length = 20)
    private String ruc;

    @Column(nullable = false, length = 100)
    private String rubro;

    @Column(length = 150)
    private String contacto;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.ACTIVO;

    public enum Estado {
        ACTIVO, INACTIVO
    }
}
