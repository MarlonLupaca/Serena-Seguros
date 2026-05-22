package com.serena.modules.comercial.cotizaciones.controller;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.comercial.cotizaciones.dto.AsignarAgenteRequest;
import com.serena.modules.comercial.cotizaciones.dto.CambioEstadoCotizacionRequest;
import com.serena.modules.comercial.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.service.CotizacionService;
import com.serena.modules.comercial.propuestas.dto.GenerarPropuestaRequest;
import com.serena.modules.comercial.propuestas.dto.PropuestaResponse;
import com.serena.modules.comercial.propuestas.service.PropuestaService;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoRequest;
import com.serena.modules.comercial.suscripcion.dto.EvaluacionRiesgoResponse;
import com.serena.modules.comercial.suscripcion.service.EvaluacionRiesgoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cotizaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('COMERCIAL', 'EJECUTIVO')")
public class CotizacionesController {

    private final CotizacionService cotizacionService;
    private final EvaluacionRiesgoService evaluacionService;
    private final PropuestaService propuestaService;

    @GetMapping
    public ResponseEntity<List<CotizacionResponse>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) LeadCotizacion.EstadoKanban estado,
            @RequestParam(value = "solo_mias", required = false) Boolean soloMias
    ) {
        return ResponseEntity.ok(cotizacionService.listar(estado, soloMias, usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CotizacionResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(cotizacionService.obtener(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CotizacionResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambioEstadoCotizacionRequest request
    ) {
        return ResponseEntity.ok(cotizacionService.cambiarEstado(id, request));
    }

    @PatchMapping("/{id}/asignar")
    public ResponseEntity<CotizacionResponse> asignar(
            @PathVariable Integer id,
            @Valid @RequestBody AsignarAgenteRequest request
    ) {
        return ResponseEntity.ok(cotizacionService.asignarAgente(id, request));
    }

    @PostMapping("/{id}/evaluacion")
    public ResponseEntity<EvaluacionRiesgoResponse> evaluar(
            @PathVariable Integer id,
            @Valid @RequestBody EvaluacionRiesgoRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(evaluacionService.registrar(id, request));
    }

    @GetMapping("/{id}/evaluacion")
    public ResponseEntity<EvaluacionRiesgoResponse> obtenerEvaluacion(@PathVariable Integer id) {
        return ResponseEntity.ok(evaluacionService.obtenerPorCotizacion(id));
    }

    @PostMapping("/{id}/propuesta")
    public ResponseEntity<PropuestaResponse> generarPropuesta(
            @PathVariable Integer id,
            @Valid @RequestBody GenerarPropuestaRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propuestaService.generar(id, request));
    }

    @GetMapping("/{id}/propuesta")
    public ResponseEntity<PropuestaResponse> obtenerPropuesta(@PathVariable Integer id) {
        return ResponseEntity.ok(propuestaService.obtenerVigente(id));
    }
}
