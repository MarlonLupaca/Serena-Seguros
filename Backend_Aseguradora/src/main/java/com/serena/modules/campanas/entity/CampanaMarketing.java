package com.serena.modules.campanas.entity;

import com.serena.modules.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "campana_marketing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampanaMarketing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campana")
    private Integer idCampana;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empleado_agente", nullable = false)
    private Empleado empleadoAgente;

    @Column(nullable = false, length = 200)
    private String asunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String plantilla;

    @Column(nullable = false)
    @Builder.Default
    private Integer enviados = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer abiertos = 0;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}
