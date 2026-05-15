package com.serena.modules.ejecutivo.riesgos.dto;

import java.util.List;

public record RiesgosResumenResponse(
        List<AlertaCalculada> alertasCalculadas,
        List<RiesgoResponse> registrosManuales
) {}
