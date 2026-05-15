package com.serena.modules.finanzas.compras.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_compra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Integer idSolicitud;

    @Column(nullable = false, length = 100)
    private String area;

    @Column(nullable = false, length = 200)
    private String producto;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "monto_estimado", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoEstimado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Prioridad prioridad = Prioridad.MEDIA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.PENDIENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado_solicitante")
    private Empleado empleadoSolicitante;

    @Column(name = "fecha_solicitud", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaSolicitud;

    public enum Prioridad {
        BAJA, MEDIA, ALTA
    }

    public enum Estado {
        PENDIENTE, APROBADO, RECHAZADO, COMPRADO
    }
}
