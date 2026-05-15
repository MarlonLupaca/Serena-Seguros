package com.serena.modules.finanzas.contabilidad.service;

import com.serena.modules.finanzas.contabilidad.dto.*;
import com.serena.modules.finanzas.contabilidad.dto.BalanceResponse.LineaCuenta;
import com.serena.modules.finanzas.contabilidad.entity.AsientoContable;
import com.serena.modules.finanzas.contabilidad.entity.CuentaContable;
import com.serena.modules.finanzas.contabilidad.entity.MovimientoContable;
import com.serena.modules.finanzas.contabilidad.repository.AsientoContableRepository;
import com.serena.modules.finanzas.contabilidad.repository.CuentaContableRepository;
import com.serena.modules.finanzas.contabilidad.repository.FacturaRepository;
import com.serena.modules.finanzas.contabilidad.repository.MovimientoContableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContabilidadService {

    private final CuentaContableRepository cuentaRepo;
    private final AsientoContableRepository asientoRepo;
    private final MovimientoContableRepository movimientoRepo;
    private final FacturaRepository facturaRepo;

    @Transactional(readOnly = true)
    public List<FacturaResponse> listarFacturas() {
        return facturaRepo.findAllByOrderByFechaEmisionDesc()
                .stream()
                .map(FacturaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AsientoResponse> listarAsientos() {
        return asientoRepo.findAllByOrderByFechaDesc().stream()
                .map(a -> {
                    List<MovimientoResponse> movs = movimientoRepo
                            .findByAsientoOrderByIdMovimientoAsc(a)
                            .stream()
                            .map(MovimientoResponse::from)
                            .toList();
                    return AsientoResponse.from(a, movs);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CuentaContableResponse> listarCuentas() {
        return cuentaRepo.findAllByOrderByCodigoAsc()
                .stream()
                .map(CuentaContableResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BalanceResponse balance() {
        Map<Integer, BigDecimal> saldos = calcularSaldosPorCuenta();
        List<LineaCuenta> activos = new ArrayList<>();
        List<LineaCuenta> pasivos = new ArrayList<>();
        List<LineaCuenta> patrimonio = new ArrayList<>();
        BigDecimal totalActivos = BigDecimal.ZERO;
        BigDecimal totalPasivos = BigDecimal.ZERO;
        BigDecimal totalPatrimonio = BigDecimal.ZERO;

        for (CuentaContable c : cuentaRepo.findAllByOrderByCodigoAsc()) {
            BigDecimal saldo = saldos.getOrDefault(c.getIdCuenta(), BigDecimal.ZERO);
            LineaCuenta linea = new LineaCuenta(c.getCodigo(), c.getNombre(), saldo);
            switch (c.getTipo()) {
                case ACTIVO -> {
                    activos.add(linea);
                    totalActivos = totalActivos.add(saldo);
                }
                case PASIVO -> {
                    pasivos.add(linea);
                    totalPasivos = totalPasivos.add(saldo);
                }
                case PATRIMONIO -> {
                    patrimonio.add(linea);
                    totalPatrimonio = totalPatrimonio.add(saldo);
                }
                default -> { /* ingresos/gastos van en el estado de resultados */ }
            }
        }
        return new BalanceResponse(activos, pasivos, patrimonio, totalActivos, totalPasivos, totalPatrimonio);
    }

    @Transactional(readOnly = true)
    public EstadoResultadosResponse estadoResultados() {
        Map<Integer, BigDecimal> saldos = calcularSaldosPorCuenta();
        List<LineaCuenta> ingresos = new ArrayList<>();
        List<LineaCuenta> gastos = new ArrayList<>();
        BigDecimal totalIngresos = BigDecimal.ZERO;
        BigDecimal totalGastos = BigDecimal.ZERO;

        for (CuentaContable c : cuentaRepo.findAllByOrderByCodigoAsc()) {
            BigDecimal saldo = saldos.getOrDefault(c.getIdCuenta(), BigDecimal.ZERO);
            LineaCuenta linea = new LineaCuenta(c.getCodigo(), c.getNombre(), saldo.abs());
            if (c.getTipo() == CuentaContable.Tipo.INGRESO) {
                ingresos.add(linea);
                totalIngresos = totalIngresos.add(saldo.abs());
            } else if (c.getTipo() == CuentaContable.Tipo.GASTO) {
                gastos.add(linea);
                totalGastos = totalGastos.add(saldo.abs());
            }
        }
        BigDecimal utilidad = totalIngresos.subtract(totalGastos);
        return new EstadoResultadosResponse(ingresos, gastos, totalIngresos, totalGastos, utilidad);
    }

    private Map<Integer, BigDecimal> calcularSaldosPorCuenta() {
        Map<Integer, BigDecimal> saldos = new HashMap<>();
        for (MovimientoContable m : movimientoRepo.findAll()) {
            Integer idCuenta = m.getCuenta().getIdCuenta();
            CuentaContable.Tipo tipo = m.getCuenta().getTipo();
            BigDecimal aporte;
            // Convencion: ACTIVO y GASTO aumentan con debe; PASIVO, PATRIMONIO e INGRESO aumentan con haber.
            if (tipo == CuentaContable.Tipo.ACTIVO || tipo == CuentaContable.Tipo.GASTO) {
                aporte = m.getDebe().subtract(m.getHaber());
            } else {
                aporte = m.getHaber().subtract(m.getDebe());
            }
            saldos.merge(idCuenta, aporte, BigDecimal::add);
        }
        return saldos;
    }
}
