package com.serena.modules.core.polizas.dto;

import com.serena.modules.seguridad.perfil.dto.BeneficiarioResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PolizaDetalleResponse(
        Integer idPoliza,
        String estadoPoliza,
        BigDecimal primaTotal,
        LocalDate vigenciaInicio,
        LocalDate vigenciaFin,
        LocalDateTime fechaEmision,
        ProductoMini producto,
        List<EndosoResponse> endosos,
        List<BeneficiarioResponse> beneficiarios,
        List<CuotaMini> pagos
) {
    public record CuotaMini(
            Integer idCuota,
            Integer numeroCuota,
            BigDecimal monto,
            LocalDate fechaVencimiento,
            String estadoPago
    ) {}
}
