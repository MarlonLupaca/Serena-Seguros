package com.serena.modules.ejecutivo.riesgos.entity;

import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "riesgo_corporativo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiesgoCorporativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_riesgo")
    private Integer idRiesgo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Severidad severidad = Severidad.MEDIA;

    @Column(name = "area_afectada", length = 100)
    private String areaAfectada;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrado_por")
    private Usuario registradoPor;

    public enum Tipo {
        CONCENTRACION, SINIESTRALIDAD, MORA, PROVEEDOR, REGULATORIO, OTRO
    }

    public enum Severidad {
        BAJA, MEDIA, ALTA, CRITICA
    }
}
