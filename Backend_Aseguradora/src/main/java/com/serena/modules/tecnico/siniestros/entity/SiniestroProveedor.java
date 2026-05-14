package com.serena.modules.tecnico.siniestros.entity;

import com.serena.modules.tecnico.proveedores.entity.ProveedorRed;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "siniestro_proveedor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiniestroProveedor {

    @EmbeddedId
    private SiniestroProveedorId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idSiniestro")
    @JoinColumn(name = "id_siniestro")
    private Siniestro siniestro;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idProveedor")
    @JoinColumn(name = "id_proveedor")
    private ProveedorRed proveedor;

    @Column(name = "costo_servicio", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoServicio;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SiniestroProveedorId implements Serializable {

        @Column(name = "id_siniestro")
        private Integer idSiniestro;

        @Column(name = "id_proveedor")
        private Integer idProveedor;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof SiniestroProveedorId other)) return false;
            return Objects.equals(idSiniestro, other.idSiniestro)
                    && Objects.equals(idProveedor, other.idProveedor);
        }

        @Override
        public int hashCode() {
            return Objects.hash(idSiniestro, idProveedor);
        }
    }
}
