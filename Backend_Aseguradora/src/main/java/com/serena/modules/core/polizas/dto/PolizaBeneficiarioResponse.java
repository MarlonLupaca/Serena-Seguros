package com.serena.modules.core.polizas.dto;

import com.serena.modules.core.polizas.entity.PolizaBeneficiario;

import java.math.BigDecimal;

public record PolizaBeneficiarioResponse(
        Integer idPolizaBeneficiario,
        Integer idPoliza,
        Integer idBeneficiario,
        String nombres,
        String apellidos,
        String parentesco,
        String documentoIdentidad,
        BigDecimal porcentaje
) {
    public static PolizaBeneficiarioResponse from(PolizaBeneficiario pb) {
        return new PolizaBeneficiarioResponse(
                pb.getIdPolizaBeneficiario(),
                pb.getPoliza().getIdPoliza(),
                pb.getBeneficiario() != null ? pb.getBeneficiario().getIdBeneficiario() : null,
                pb.getNombres(),
                pb.getApellidos(),
                pb.getParentesco(),
                pb.getDocumentoIdentidad(),
                pb.getPorcentaje()
        );
    }
}
