package com.serena.modules.core.polizas.dto;

import com.serena.modules.comercial.propuestas.dto.PropuestaResponse;
import com.serena.modules.tecnico.documentos.dto.DocumentoResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PolizaDetalleResponse(
        Integer idPoliza,
        String estadoPoliza,
        BigDecimal primaTotal,
        BigDecimal sumaAsegurada,
        BigDecimal deducible,
        String frecuenciaPago,
        Integer numeroCuotas,
        LocalDate vigenciaInicio,
        LocalDate vigenciaFin,
        LocalDateTime fechaEmision,
        Integer idPolizaPadre,
        ProductoMini producto,
        PropuestaResponse propuesta,
        List<EndosoResponse> endosos,
        List<PolizaBeneficiarioResponse> beneficiarios,
        List<CuotaMini> pagos,
        List<DocumentoResponse> documentos
) {
    public record CuotaMini(
            Integer idCuota,
            Integer numeroCuota,
            BigDecimal monto,
            LocalDate fechaVencimiento,
            String estadoPago
    ) {}
}
