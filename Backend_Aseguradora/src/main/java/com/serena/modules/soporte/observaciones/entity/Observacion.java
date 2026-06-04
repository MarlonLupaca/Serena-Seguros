package com.serena.modules.soporte.observaciones.entity;

import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "observacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Observacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_observacion")
    private Integer idObservacion;

    @Column(name = "tipo_referencia", nullable = false, length = 50)
    private String tipoReferencia; // Ej: "SINIESTRO", "COTIZACION", "ENDOSO"

    @Column(name = "id_referencia", nullable = false)
    private Integer idReferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_autor")
    private Usuario autor;

    @Column(name = "autor_rol", nullable = false, length = 50)
    private String autorRol; // "TECNICO", "CLIENTE"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}
