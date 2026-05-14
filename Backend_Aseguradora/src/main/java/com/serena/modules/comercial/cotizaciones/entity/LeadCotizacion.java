package com.serena.modules.comercial.cotizaciones.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lead_cotizacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadCotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cotizacion")
    private Integer idCotizacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empleado_agente", nullable = false)
    private Empleado empleadoAgente;

    @Enumerated(EnumType.STRING)
    @Column(name = "producto_interes", nullable = false)
    private ProductoInteres productoInteres;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_kanban", nullable = false)
    @Builder.Default
    private EstadoKanban estadoKanban = EstadoKanban.NUEVO;

    @Column(name = "prima_estimada", precision = 10, scale = 2)
    private BigDecimal primaEstimada;

    @Column(name = "fecha_ingreso", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaIngreso;

    public enum ProductoInteres {
        VEHICULAR, SALUD, VIDA, HOGAR, VIAJE, EMPRESA
    }

    public enum EstadoKanban {
        NUEVO, CONTACTADO, EN_PROPUESTA, NEGOCIACION, GANADO, PERDIDO
    }
}
