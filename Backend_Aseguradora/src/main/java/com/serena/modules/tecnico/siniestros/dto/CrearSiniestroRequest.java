package com.serena.modules.tecnico.siniestros.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearSiniestroRequest {

        @NotNull(message = "La poliza es obligatoria")
        private Integer idPoliza;

        @NotBlank(message = "El tipo de incidente es obligatorio")
        @Size(max = 100)
        private String tipoIncidente;

        @NotBlank(message = "La descripcion es obligatoria")
        private String descripcion;

        @NotNull(message = "La fecha de ocurrencia es obligatoria")
        @PastOrPresent(message = "La fecha de ocurrencia no puede ser futura")
        private LocalDate fechaOcurrencia;

        @NotNull(message = "El monto reclamado es obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
        private BigDecimal montoReclamado;

}