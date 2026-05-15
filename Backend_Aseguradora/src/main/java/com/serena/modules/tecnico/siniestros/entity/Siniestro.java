package com.serena.modules.tecnico.siniestros.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.core.polizas.entity.Poliza;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "siniestro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Siniestro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_siniestro")
    private Integer idSiniestro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_poliza", nullable = false)
    private Poliza poliza;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado_analista")
    private Empleado empleadoAnalista;

    @Column(name = "tipo_incidente", nullable = false, length = 100)
    private String tipoIncidente;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_ocurrencia", nullable = false)
    private LocalDate fechaOcurrencia;

    @Column(name = "fecha_reporte", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaReporte;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_resolucion", nullable = false)
    @Builder.Default
    private EstadoResolucion estadoResolucion = EstadoResolucion.REPORTADO;

    @Column(name = "monto_reclamado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoReclamado;

    @Column(name = "observaciones_perito", columnDefinition = "TEXT")
    private String observacionesPerito;

    @Column(name = "monto_estimado_perito", precision = 12, scale = 2)
    private BigDecimal montoEstimadoPerito;

    @Column(name = "informe_tecnico", length = 500)
    private String informeTecnico;

    public enum EstadoResolucion {
        REPORTADO, EN_REVISION, INSPECCION, APROBADO, RECHAZADO, LIQUIDADO
    }
}
