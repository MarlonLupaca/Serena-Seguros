package com.serena.modules.siniestros.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CrearSiniestroRequest(

        @NotNull(message = "La poliza es obligatoria")
        Integer idPoliza,

        @NotBlank(message = "El tipo de incidente es obligatorio")
        @Size(max = 100)
        String tipoIncidente,

        @NotBlank(message = "La descripcion es obligatoria")
        String descripcion,

        @NotNull(message = "La fecha de ocurrencia es obligatoria")
        @PastOrPresent(message = "La fecha de ocurrencia no puede ser futura")
        LocalDate fechaOcurrencia,

        @NotNull(message = "El monto reclamado es obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
        BigDecimal montoReclamado

) {}
