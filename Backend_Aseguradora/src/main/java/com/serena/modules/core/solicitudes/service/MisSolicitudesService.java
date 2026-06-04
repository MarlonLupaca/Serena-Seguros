package com.serena.modules.core.solicitudes.service;

import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.core.polizas.entity.EndosoPoliza;
import com.serena.modules.core.polizas.repository.EndosoPolizaRepository;
import com.serena.modules.core.solicitudes.dto.SolicitudUnificadaResponse;
import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MisSolicitudesService {

    private final LeadCotizacionRepository cotizacionRepository;
    private final SiniestroRepository siniestroRepository;
    private final EndosoPolizaRepository endosoPolizaRepository;
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public List<SolicitudUnificadaResponse> obtenerSolicitudesUnificadas(Usuario usuario) {
        Persona persona = personaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new IllegalStateException("El usuario no tiene una persona asociada"));
        Cliente cliente = clienteRepository.findByPersona(persona)
                .orElseThrow(() -> new IllegalStateException("El usuario no es un cliente válido"));

        List<SolicitudUnificadaResponse> solicitudes = new ArrayList<>();

        // 1. Cotizaciones (Nuevas Pólizas)
        List<LeadCotizacion> cotizaciones = cotizacionRepository.findByClienteOrderByFechaIngresoDesc(cliente);
        for (LeadCotizacion c : cotizaciones) {
            solicitudes.add(new SolicitudUnificadaResponse(
                    "COT-" + String.format("%06d", c.getIdCotizacion()),
                    "NUEVA POLIZA",
                    c.getFechaIngreso(),
                    "Solicitud de Seguro " + (c.getProducto() != null ? c.getProducto().getNombre() : "Pendiente"),
                    c.getEstadoKanban().name()
            ));
        }

        // 2. Siniestros
        List<Siniestro> siniestros = siniestroRepository.findByPolizaClienteOrderByFechaReporteDesc(cliente);
        for (Siniestro s : siniestros) {
            solicitudes.add(new SolicitudUnificadaResponse(
                    "SIN-" + String.format("%06d", s.getIdSiniestro()),
                    "SINIESTRO",
                    s.getFechaReporte(),
                    "Siniestro reportado en póliza POL-" + String.format("%06d", s.getPoliza().getIdPoliza()),
                    s.getEstadoResolucion().name()
            ));
        }

        // 3. Endosos
        List<EndosoPoliza> endosos = endosoPolizaRepository.findByPoliza_ClienteOrderByFechaSolicitudDesc(cliente);
        for (EndosoPoliza e : endosos) {
            solicitudes.add(new SolicitudUnificadaResponse(
                    "END-" + String.format("%06d", e.getIdEndoso()),
                    "ENDOSO",
                    e.getFechaSolicitud(),
                    "Endoso tipo: " + e.getTipoCambio() + " para póliza POL-" + String.format("%06d", e.getPoliza().getIdPoliza()),
                    e.getEstadoAprobacion().name()
            ));
        }

        // Ordenar globalmente por fecha (más reciente primero)
        solicitudes.sort(Comparator.comparing(SolicitudUnificadaResponse::fecha).reversed());

        return solicitudes;
    }
}
