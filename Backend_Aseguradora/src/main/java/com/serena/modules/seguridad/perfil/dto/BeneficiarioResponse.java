package com.serena.modules.seguridad.perfil.dto;

import com.serena.modules.seguridad.perfil.entity.Beneficiario;

import java.math.BigDecimal;

public record BeneficiarioResponse(
        Integer idBeneficiario,
        String nombres,
        String apellidos,
        String parentesco,
        String documentoIdentidad,
        BigDecimal porcentaje
) {
    public static BeneficiarioResponse from(Beneficiario b) {
        return new BeneficiarioResponse(
                b.getIdBeneficiario(),
                b.getNombres(),
                b.getApellidos(),
                b.getParentesco(),
                b.getDocumentoIdentidad(),
                b.getPorcentaje()
        );
    }
}
