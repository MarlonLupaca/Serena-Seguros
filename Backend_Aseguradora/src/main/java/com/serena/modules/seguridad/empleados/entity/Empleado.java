package com.serena.modules.seguridad.empleados.entity;

import com.serena.modules.seguridad.auth.entity.Persona;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "empleado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_persona", nullable = false, unique = true)
    private Persona persona;

    @Column(nullable = false, length = 100)
    private String cargo;

    @Column(nullable = false, length = 100)
    private String area;

    @Column(name = "sueldo_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal sueldoBase;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_jefe")
    private Empleado jefe;

    @Column(name = "dias_vacaciones", nullable = false)
    @Builder.Default
    private Integer diasVacaciones = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_empleado", nullable = false)
    @Builder.Default
    private EstadoEmpleado estadoEmpleado = EstadoEmpleado.ACTIVO;

    public enum EstadoEmpleado {
        ACTIVO, VACACIONES, LICENCIA, RETIRADO
    }
}
