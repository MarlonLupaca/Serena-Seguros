package com.serena.modules.seguridad.clientes.dto;

import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.core.polizas.dto.PolizaResponse;
import com.serena.modules.finanzas.cuotas.dto.CuotaResponse;
import com.serena.modules.tecnico.siniestros.dto.SiniestroAdminResponse;

import java.util.List;

public record ClienteResumenResponse(
        ClienteResponse cliente,
        List<PolizaResponse> polizas,
        List<CuotaResponse> cuotas,
        List<SiniestroAdminResponse> siniestros,
        List<CotizacionResponse> historialComercial,
        List<NotaClienteResponse> notas
) {}
