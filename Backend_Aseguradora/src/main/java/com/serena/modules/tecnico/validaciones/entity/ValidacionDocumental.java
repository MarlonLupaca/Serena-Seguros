package com.serena.modules.tecnico.validaciones.entity;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.tecnico.documentos.entity.DocumentoAuditoria;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "validacion_documental")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidacionDocumental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_validacion")
    private Integer idValidacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_documento")
    private DocumentoAuditoria documento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Estado estado = Estado.PENDIENTE;

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado_validador")
    private Empleado empleadoValidador;

    @Column(name = "fecha_ingreso", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaIngreso;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    public enum Estado {
        PENDIENTE, APROBADO, RECHAZADO, CORRECCION
    }
}
