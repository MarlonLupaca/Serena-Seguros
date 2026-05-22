package com.serena.modules.finanzas.cuotas.service;

import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.finanzas.cuotas.dto.CuotaResponse;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.service.NotificacionService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CuotaService {

    private final CuotaRepository cuotaRepository;
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;
    private final PolizaRepository polizaRepository;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;

    @Transactional(readOnly = true)
    public List<CuotaResponse> misCuotas(Usuario usuario, Cuota.EstadoPago estado) {
        Cliente cliente = clienteDelUsuario(usuario);
        List<Cuota> cuotas = (estado != null)
                ? cuotaRepository.findByPolizaClienteAndEstadoPagoOrderByFechaVencimientoAsc(cliente, estado)
                : cuotaRepository.findByPolizaClienteOrderByFechaVencimientoAsc(cliente);
        return cuotas.stream().map(CuotaResponse::from).toList();
    }

    @Transactional
    public CuotaResponse pagar(Usuario usuario, Integer idCuota) {
        Cliente cliente = clienteDelUsuario(usuario);
        Cuota cuota = cuotaRepository.findById(idCuota)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cuota", idCuota));
        if (!cuota.getPoliza().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La cuota no pertenece al usuario");
        }
        if (cuota.getEstadoPago() == Cuota.EstadoPago.PAGADO) {
            return CuotaResponse.from(cuota);
        }
        cuota.setEstadoPago(Cuota.EstadoPago.PAGADO);
        Cuota actualizada = cuotaRepository.save(cuota);

        if (Integer.valueOf(1).equals(cuota.getNumeroCuota())) {
            activarPolizaSiPendiente(cuota.getPoliza(), usuario);
        }
        auditoriaService.registrar("PAGAR_CUOTA", "FINANZAS",
                "Cuota " + cuota.getNumeroCuota() + " de poliza " + cuota.getPoliza().getIdPoliza());

        notificacionService.crearParaPortal(Usuario.PortalAcceso.OPERATIVO,
                Notificacion.Tipo.COBRANZA,
                "Pago recibido del asegurado",
                "Cuota " + cuota.getNumeroCuota() + " poliza #" + cuota.getPoliza().getIdPoliza()
                        + " S/ " + cuota.getMonto(),
                "/operativo/cobranza");

        return CuotaResponse.from(actualizada);
    }

    /**
     * Genera N cuotas espaciadas segun la frecuencia de pago de la poliza.
     * La fecha base de vencimiento de la primera cuota es hoy + 7 dias.
     */
    @Transactional
    public List<Cuota> generarCuotasParaPoliza(Poliza poliza) {
        Integer total = poliza.getNumeroCuotas() != null && poliza.getNumeroCuotas() > 0
                ? poliza.getNumeroCuotas()
                : 1;
        Poliza.FrecuenciaPago frecuencia = poliza.getFrecuenciaPago() != null
                ? poliza.getFrecuenciaPago()
                : Poliza.FrecuenciaPago.MENSUAL;
        BigDecimal montoCuota = poliza.getPrimaTotal()
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);

        List<Cuota> generadas = new ArrayList<>();
        LocalDate base = LocalDate.now().plusDays(7);
        for (int i = 1; i <= total; i++) {
            Cuota c = Cuota.builder()
                    .poliza(poliza)
                    .numeroCuota(i)
                    .monto(montoCuota)
                    .fechaVencimiento(siguienteVencimiento(base, i - 1, frecuencia))
                    .estadoPago(Cuota.EstadoPago.PENDIENTE)
                    .build();
            generadas.add(cuotaRepository.save(c));
        }
        return generadas;
    }

    private LocalDate siguienteVencimiento(LocalDate base, int offset, Poliza.FrecuenciaPago frecuencia) {
        return switch (frecuencia) {
            case UNICO -> base;
            case MENSUAL -> base.plusMonths(offset);
            case TRIMESTRAL -> base.plusMonths(offset * 3L);
            case ANUAL -> base.plusYears(offset);
        };
    }

    private void activarPolizaSiPendiente(Poliza poliza, Usuario usuario) {
        if (poliza.getEstadoPoliza() != Poliza.EstadoPoliza.PENDIENTE) return;
        LocalDate hoy = LocalDate.now();
        int meses = poliza.getPropuesta() != null && poliza.getPropuesta().getVigenciaMeses() != null
                ? poliza.getPropuesta().getVigenciaMeses()
                : 12;
        poliza.setEstadoPoliza(Poliza.EstadoPoliza.ACTIVA);
        poliza.setVigenciaInicio(hoy);
        poliza.setVigenciaFin(hoy.plusMonths(meses));
        polizaRepository.save(poliza);

        auditoriaService.registrar("ACTIVAR_POLIZA", "CORE",
                "Poliza " + poliza.getIdPoliza() + " activada por pago de cuota 1");
        notificacionService.crear(usuario, Notificacion.Tipo.COBRANZA,
                "Tu poliza fue activada",
                "Pagaste la primera cuota. La poliza esta vigente hasta " + poliza.getVigenciaFin(),
                "/asegurado/polizas");
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }
}
