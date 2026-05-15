package com.serena.modules.ejecutivo.riesgos.dto;

import java.math.BigDecimal;

public record AlertaCalculada(
        String tipo,
        String titulo,
        String descripcion,
        String severidad,
        BigDecimal valor,
        String unidad
) {}
