package com.serena.modules.tecnico.indemnizaciones.dto;

import com.serena.modules.tecnico.indemnizaciones.entity.Indemnizacion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record RegistrarIndemnizacionRequest(
        @NotNull @Positive BigDecimal montoAprobado,
        BigDecimal montoPagado,
        Integer idPolizaBeneficiario,
        Indemnizacion.MedioPago medioPago,
        String observaciones
) {}
