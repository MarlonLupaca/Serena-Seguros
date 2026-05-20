package com.serena.modules.core.productos.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "producto_seguro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoSeguro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_seguro", nullable = false)
    private TipoSeguro tipoSeguro;

    @Column(name = "prima_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal primaBase;

    @Column(name = "limites_cobertura", columnDefinition = "TEXT")
    private String limitesCobertura;

    @Column(name = "restricciones_edad", nullable = false)
    @Builder.Default
    private Integer restriccionesEdad = 18;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal tasas = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.ACTIVO;

    public enum TipoSeguro {
        VEHICULAR, SALUD, VIDA, HOGAR, VIAJE, EMPRESA, SOAT, MASCOTAS
    }

    public enum Estado {
        ACTIVO, INACTIVO
    }
}
