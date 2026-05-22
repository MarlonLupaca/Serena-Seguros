package com.serena.modules.comercial.cotizaciones.controller;

import com.serena.modules.comercial.cotizaciones.dto.AceptarPropuestaRequest;
import com.serena.modules.comercial.cotizaciones.dto.ContratacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.ContratarCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.MiCotizacionResponse;
import com.serena.modules.comercial.cotizaciones.dto.GuardarCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.service.CotizacionService;
import com.serena.modules.comercial.propuestas.dto.GenerarPropuestaRequest;
import com.serena.modules.comercial.propuestas.dto.PropuestaResponse;
import com.serena.modules.comercial.propuestas.service.PropuestaService;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoRequest;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoResponse;
import com.serena.modules.comercial.suscripcion.service.EvaluacionRiesgoService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mis-cotizaciones")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASEGURADO')")
public class MisCotizacionesController {

    private final CotizacionService cotizacionService;
    private final EvaluacionRiesgoService evaluacionService;
    private final PropuestaService propuestaService;

    @GetMapping
    public ResponseEntity<java.util.List<MiCotizacionResponse>> misCotizaciones(
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(cotizacionService.misCotizaciones(usuario));
    }

    @GetMapping("/{id}/evaluacion")
    public ResponseEntity<EvaluacionRiesgoResponse> obtenerEvaluacion(@PathVariable Integer id) {
        return ResponseEntity.ok(evaluacionService.obtenerPorCotizacion(id));
    }

    @PostMapping
    public ResponseEntity<CotizacionResponse> crear(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CrearCotizacionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cotizacionService.crear(usuario, request));
    }

    @PostMapping("/guardar")
    public ResponseEntity<CotizacionResponse> guardar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody GuardarCotizacionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cotizacionService.guardar(usuario, request));
    }

    @PostMapping("/{id}/evaluacion")
    public ResponseEntity<EvaluacionRiesgoResponse> evaluar(
            @PathVariable Integer id,
            @Valid @RequestBody EvaluacionRiesgoRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(evaluacionService.registrar(id, request));
    }

    @PostMapping("/{id}/propuesta")
    public ResponseEntity<PropuestaResponse> proponer(
            @PathVariable Integer id,
            @Valid @RequestBody GenerarPropuestaRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propuestaService.generar(id, request));
    }

    @GetMapping("/{id}/propuesta")
    public ResponseEntity<PropuestaResponse> obtenerPropuesta(@PathVariable Integer id) {
        return ResponseEntity.ok(propuestaService.obtenerVigente(id));
    }

    @PostMapping("/{id}/aceptar")
    public ResponseEntity<ContratacionResponse> aceptar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id,
            @Valid @RequestBody AceptarPropuestaRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cotizacionService.aceptar(usuario, id, request));
    }

    /**
     * Endpoint legado mantenido por compatibilidad. Prefiere el flujo
     * evaluacion -> propuesta -> aceptar.
     */
    @Deprecated
    @PostMapping("/{id}/contratar")
    public ResponseEntity<ContratacionResponse> contratar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer id,
            @Valid @RequestBody ContratarCotizacionRequest request
    ) {
        return ResponseEntity.ok(cotizacionService.contratar(usuario, id, request));
    }
}
