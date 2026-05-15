package com.serena.modules.seguridad.clientes.entity;

import com.serena.modules.seguridad.empleados.entity.Empleado;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "nota_cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota")
    private Integer idNota;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado_autor")
    private Empleado empleadoAutor;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fecha;
}
