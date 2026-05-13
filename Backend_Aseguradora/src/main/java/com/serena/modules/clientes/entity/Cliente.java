package com.serena.modules.clientes.entity;

import com.serena.modules.auth.entity.Persona;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_persona", nullable = false, unique = true)
    private Persona persona;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_crm", nullable = false)
    @Builder.Default
    private EstadoCrm estadoCrm = EstadoCrm.NUEVO;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaRegistro;

    public enum EstadoCrm {
        NUEVO, CONTACTADO, CLIENTE, INACTIVO
    }
}
