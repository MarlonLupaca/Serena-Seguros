package com.serena.modules.finanzas.nomina.service;

import com.serena.modules.finanzas.nomina.dto.DetallePlanillaResponse;
import com.serena.modules.finanzas.nomina.dto.PlanillaResponse;
import com.serena.modules.finanzas.nomina.dto.ProcesarPlanillaRequest;
import com.serena.modules.finanzas.nomina.entity.DetallePlanilla;
import com.serena.modules.finanzas.nomina.entity.PlanillaMensual;
import com.serena.modules.finanzas.nomina.repository.DetallePlanillaRepository;
import com.serena.modules.finanzas.nomina.repository.PlanillaMensualRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NominaService {

    // Tasas referenciales para calculo de planilla
    private static final BigDecimal TASA_AFP_ONP = new BigDecimal("0.1275"); // 12.75%
    private static final BigDecimal TASA_RENTA = new BigDecimal("0.08");     // 8% renta 5ta
    private static final BigDecimal BONO_BASE = new BigDecimal("150.00");
    private static final BigDecimal HORAS_EXTRA_BASE = new BigDecimal("90.00");

    private final PlanillaMensualRepository planillaRepository;
    private final DetallePlanillaRepository detalleRepository;
    private final EmpleadoRepository empleadoRepository;
    private final AuditoriaService auditoria;

    @Transactional(readOnly = true)
    public List<PlanillaResponse> listar() {
        return planillaRepository.findAllByOrderByPeriodoDesc()
                .stream()
                .map(PlanillaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DetallePlanillaResponse> detalles(Integer idPlanilla) {
        PlanillaMensual planilla = planillaRepository.findById(idPlanilla)
                .orElseThrow(() -> new RecursoNoEncontradoException("Planilla", idPlanilla));
        return detalleRepository.findByPlanillaOrderByIdDetalleAsc(planilla)
                .stream()
                .map(DetallePlanillaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlanillaResponse resumen(String periodo) {
        return planillaRepository.findByPeriodo(periodo)
                .map(PlanillaResponse::from)
                .orElseThrow(() -> new RecursoNoEncontradoException("Planilla del periodo " + periodo, 0));
    }

    @Transactional
    public PlanillaResponse procesar(ProcesarPlanillaRequest request) {
        if (planillaRepository.findByPeriodo(request.periodo()).isPresent()) {
            throw new IllegalStateException("Ya existe una planilla para el periodo " + request.periodo());
        }

        List<Empleado> empleados = empleadoRepository.findAll().stream()
                .filter(e -> e.getEstadoEmpleado() == null
                        || e.getEstadoEmpleado() == Empleado.EstadoEmpleado.ACTIVO
                        || e.getEstadoEmpleado() == Empleado.EstadoEmpleado.LICENCIA)
                .toList();

        if (empleados.isEmpty()) {
            throw new IllegalStateException("No hay empleados activos para procesar la planilla");
        }

        PlanillaMensual planilla = planillaRepository.save(PlanillaMensual.builder()
                .periodo(request.periodo())
                .estado(PlanillaMensual.Estado.PROCESADA)
                .build());

        BigDecimal totalBruto = BigDecimal.ZERO;
        BigDecimal totalDescuentos = BigDecimal.ZERO;
        BigDecimal totalNeto = BigDecimal.ZERO;

        for (Empleado e : empleados) {
            BigDecimal base = e.getSueldoBase() != null ? e.getSueldoBase() : BigDecimal.ZERO;
            BigDecimal bonos = BONO_BASE;
            BigDecimal extras = HORAS_EXTRA_BASE;
            BigDecimal bruto = base.add(bonos).add(extras);
            BigDecimal afp = bruto.multiply(TASA_AFP_ONP).setScale(2, RoundingMode.HALF_UP);
            BigDecimal renta = bruto.multiply(TASA_RENTA).setScale(2, RoundingMode.HALF_UP);
            BigDecimal neto = bruto.subtract(afp).subtract(renta).setScale(2, RoundingMode.HALF_UP);

            detalleRepository.save(DetallePlanilla.builder()
                    .planilla(planilla)
                    .empleado(e)
                    .sueldoBase(base)
                    .bonos(bonos)
                    .horasExtra(extras)
                    .afpOnp(afp)
                    .impuestoRenta(renta)
                    .neto(neto)
                    .build());

            totalBruto = totalBruto.add(bruto);
            totalDescuentos = totalDescuentos.add(afp).add(renta);
            totalNeto = totalNeto.add(neto);
        }

        planilla.setTotalPlanilla(totalBruto);
        planilla.setTotalDescuentos(totalDescuentos);
        planilla.setTotalNeto(totalNeto);
        planillaRepository.save(planilla);

        auditoria.registrar("planilla_procesada", "nomina",
                "Periodo " + request.periodo() + " · " + empleados.size() + " empleados · neto " + totalNeto);

        return PlanillaResponse.from(planilla);
    }
}
