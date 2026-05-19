package com.serena.shared.scheduler;

import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Job diario que sincroniza estados de polizas y cuotas con el calendario.
 * Cron 00:05 todos los dias.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PolizaSchedulerJob {

    private final PolizaRepository polizaRepository;
    private final CuotaRepository cuotaRepository;
    private final AuditoriaService auditoriaService;

    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void marcarVencimientos() {
        LocalDate hoy = LocalDate.now();
        int polizasVencidas = 0;
        for (Poliza poliza : polizaRepository.findByEstadoPolizaOrderByFechaEmisionDesc(Poliza.EstadoPoliza.ACTIVA)) {
            if (poliza.getVigenciaFin() != null && poliza.getVigenciaFin().isBefore(hoy)) {
                poliza.setEstadoPoliza(Poliza.EstadoPoliza.VENCIDA);
                polizaRepository.save(poliza);
                polizasVencidas++;
            }
        }

        int cuotasVencidas = 0;
        for (Cuota cuota : cuotaRepository.findByEstadoPagoOrderByFechaVencimientoAsc(Cuota.EstadoPago.PENDIENTE)) {
            if (cuota.getFechaVencimiento() != null && cuota.getFechaVencimiento().isBefore(hoy)) {
                cuota.setEstadoPago(Cuota.EstadoPago.VENCIDO);
                cuotaRepository.save(cuota);
                cuotasVencidas++;
            }
        }

        if (polizasVencidas + cuotasVencidas > 0) {
            String detalle = "Polizas vencidas: " + polizasVencidas + ", cuotas vencidas: " + cuotasVencidas;
            log.info("[Scheduler] {}", detalle);
            auditoriaService.registrar("SCHEDULER_VENCIMIENTOS", "SISTEMA", detalle);
        }
    }
}
