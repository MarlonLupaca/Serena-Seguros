package com.serena.modules.tecnico.indemnizaciones.service;

import com.serena.modules.core.polizas.entity.PolizaBeneficiario;
import com.serena.modules.core.polizas.repository.PolizaBeneficiarioRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.modules.tecnico.indemnizaciones.dto.IndemnizacionResponse;
import com.serena.modules.tecnico.indemnizaciones.dto.RegistrarIndemnizacionRequest;
import com.serena.modules.tecnico.indemnizaciones.entity.Indemnizacion;
import com.serena.modules.tecnico.indemnizaciones.repository.IndemnizacionRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IndemnizacionService {

    private final IndemnizacionRepository repository;
    private final SiniestroRepository siniestroRepository;
    private final PolizaBeneficiarioRepository polizaBeneficiarioRepository;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;

    @Transactional
    public IndemnizacionResponse registrar(Integer idSiniestro, RegistrarIndemnizacionRequest request) {
        Siniestro siniestro = siniestroRepository.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        if (siniestro.getEstadoResolucion() != Siniestro.EstadoResolucion.APROBADO
                && siniestro.getEstadoResolucion() != Siniestro.EstadoResolucion.LIQUIDADO) {
            throw new IllegalStateException(
                    "Solo se puede indemnizar un siniestro APROBADO o ya LIQUIDADO. Estado actual: "
                            + siniestro.getEstadoResolucion());
        }
        PolizaBeneficiario polben = request.idPolizaBeneficiario() != null
                ? polizaBeneficiarioRepository.findById(request.idPolizaBeneficiario())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "PolizaBeneficiario", request.idPolizaBeneficiario()))
                : null;

        BigDecimal montoPagado = request.montoPagado() != null ? request.montoPagado() : BigDecimal.ZERO;
        Indemnizacion indem = Indemnizacion.builder()
                .siniestro(siniestro)
                .polizaBeneficiario(polben)
                .montoAprobado(request.montoAprobado())
                .montoPagado(montoPagado)
                .medioPago(request.medioPago() != null ? request.medioPago() : Indemnizacion.MedioPago.TRANSFERENCIA)
                .observaciones(request.observaciones())
                .fechaPago(montoPagado.compareTo(BigDecimal.ZERO) > 0 ? LocalDateTime.now() : null)
                .build();
        Indemnizacion guardada = repository.save(indem);

        siniestro.setEstadoResolucion(Siniestro.EstadoResolucion.LIQUIDADO);
        siniestroRepository.save(siniestro);

        auditoriaService.registrar("REGISTRAR_INDEMNIZACION", "TECNICO",
                "Siniestro " + idSiniestro + " indemnizado por S/ " + request.montoAprobado());
        var usuarioAsegurado = siniestro.getPoliza().getCliente().getPersona().getUsuario();
        notificacionService.crear(usuarioAsegurado, Notificacion.Tipo.SINIESTRO,
                "Indemnizacion aprobada",
                "Tu siniestro #" + idSiniestro + " fue liquidado por S/ " + request.montoAprobado(),
                "/asegurado/reportar");

        return IndemnizacionResponse.from(guardada);
    }

    @Transactional(readOnly = true)
    public List<IndemnizacionResponse> listarPorSiniestro(Integer idSiniestro) {
        Siniestro siniestro = siniestroRepository.findById(idSiniestro)
                .orElseThrow(() -> new RecursoNoEncontradoException("Siniestro", idSiniestro));
        return repository.findBySiniestro(siniestro).stream()
                .map(IndemnizacionResponse::from)
                .toList();
    }
}
