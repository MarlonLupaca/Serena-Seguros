package com.serena.modules.core.polizas.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.propuestas.dto.PropuestaResponse;
import com.serena.modules.comercial.propuestas.entity.PropuestaPoliza;
import com.serena.modules.comercial.suscripcion.entity.EvaluacionRiesgo;
import com.serena.modules.comercial.suscripcion.service.EvaluacionRiesgoService;
import com.serena.modules.core.polizas.dto.CambioEstadoPolizaRequest;
import com.serena.modules.core.polizas.dto.CrearEndosoRequest;
import com.serena.modules.core.polizas.dto.DesignarBeneficiariosRequest;
import com.serena.modules.core.polizas.dto.EmitirPolizaRequest;
import com.serena.modules.core.polizas.dto.EndosoResponse;
import com.serena.modules.core.polizas.dto.PolizaBeneficiarioResponse;
import com.serena.modules.core.polizas.dto.PolizaDetalleResponse;
import com.serena.modules.core.polizas.dto.PolizaDetalleResponse.CuotaMini;
import com.serena.modules.core.polizas.dto.PolizaResponse;
import com.serena.modules.core.polizas.dto.ProductoMini;
import com.serena.modules.core.polizas.entity.EndosoPoliza;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.entity.PolizaBeneficiario;
import com.serena.modules.core.polizas.repository.EndosoPolizaRepository;
import com.serena.modules.core.polizas.repository.PolizaBeneficiarioRepository;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.core.productos.entity.ProductoSeguro;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import com.serena.modules.finanzas.cuotas.entity.Cuota;
import com.serena.modules.finanzas.cuotas.repository.CuotaRepository;
import com.serena.modules.finanzas.cuotas.service.CuotaService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.perfil.entity.Beneficiario;
import com.serena.modules.seguridad.perfil.repository.BeneficiarioRepository;
import com.serena.modules.tecnico.documentos.dto.DocumentoResponse;
import com.serena.modules.tecnico.documentos.service.DocumentoService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PolizaService {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final PolizaRepository polizaRepository;
    private final EndosoPolizaRepository endosoRepository;
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;
    private final ProductoSeguroRepository productoRepository;
    private final CuotaRepository cuotaRepository;
    private final BeneficiarioRepository beneficiarioRepository;
    private final PolizaBeneficiarioRepository polizaBeneficiarioRepository;
    private final EvaluacionRiesgoService evaluacionService;
    private final CuotaService cuotaService;
    private final DocumentoService documentoService;

    @Transactional(readOnly = true)
    public List<PolizaResponse> misPolizas(Usuario usuario, Poliza.EstadoPoliza estado) {
        Cliente cliente = clienteDelUsuario(usuario);
        List<Poliza> polizas = (estado != null)
                ? polizaRepository.findByClienteAndEstadoPolizaOrderByFechaEmisionDesc(cliente, estado)
                : polizaRepository.findByClienteOrderByFechaEmisionDesc(cliente);
        return polizas.stream().map(PolizaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PolizaDetalleResponse miPolizaDetalle(Usuario usuario, Integer idPoliza) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        return aDetalle(poliza);
    }

    @Transactional
    public EndosoResponse solicitarEndoso(Usuario usuario, Integer idPoliza, CrearEndosoRequest request) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        EndosoPoliza endoso = EndosoPoliza.builder()
                .poliza(poliza)
                .tipoCambio(request.tipoCambio())
                .descripcionCambio(request.descripcionCambio())
                .archivoUrl(request.archivoUrl())
                .estadoAprobacion(EndosoPoliza.EstadoAprobacion.PENDIENTE)
                .build();
        return EndosoResponse.from(endosoRepository.save(endoso));
    }

    @Transactional(readOnly = true)
    public List<PolizaResponse> listarTodas(Poliza.EstadoPoliza estado) {
        List<Poliza> polizas = (estado != null)
                ? polizaRepository.findByEstadoPolizaOrderByFechaEmisionDesc(estado)
                : polizaRepository.findAllByOrderByFechaEmisionDesc();
        return polizas.stream().map(PolizaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PolizaDetalleResponse detalleAdmin(Integer idPoliza) {
        Poliza poliza = polizaRepository.findById(idPoliza)
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", idPoliza));
        return aDetalle(poliza);
    }

    @Transactional
    public PolizaResponse emitir(EmitirPolizaRequest request) {
        Cliente cliente = clienteRepository.findById(request.idCliente())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", request.idCliente()));
        ProductoSeguro producto = productoRepository.findById(request.idProducto())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", request.idProducto()));
        Poliza poliza = Poliza.builder()
                .cliente(cliente)
                .producto(producto)
                .primaTotal(request.primaTotal())
                .estadoPoliza(Poliza.EstadoPoliza.ACTIVA)
                .vigenciaInicio(request.vigenciaInicio())
                .vigenciaFin(request.vigenciaFin())
                .build();
        return PolizaResponse.from(polizaRepository.save(poliza));
    }

    /**
     * Crea una poliza en estado PENDIENTE a partir de una propuesta aceptada.
     * Genera las cuotas asociadas y mantiene la trazabilidad de renovacion via
     * {@code polizaPadre}.
     */
    @Transactional
    public Poliza crearDesdePropuesta(PropuestaPoliza propuesta, Cliente cliente, Poliza polizaPadre) {
        ProductoSeguro producto = propuesta.getCotizacion().getProducto();
        if (producto == null) {
            throw new IllegalStateException("La propuesta no tiene un producto asociado");
        }

        Poliza poliza = Poliza.builder()
                .cliente(cliente)
                .producto(producto)
                .propuesta(propuesta)
                .polizaPadre(polizaPadre)
                .primaTotal(propuesta.getPrimaCalculada())
                .sumaAsegurada(propuesta.getSumaAsegurada())
                .deducible(propuesta.getDeducible())
                .frecuenciaPago(Poliza.FrecuenciaPago.valueOf(propuesta.getFrecuenciaPago().name()))
                .numeroCuotas(propuesta.getNumeroCuotas())
                .estadoPoliza(Poliza.EstadoPoliza.PENDIENTE)
                .vigenciaInicio(LocalDate.now().plusDays(7))
                .vigenciaFin(LocalDate.now().plusDays(7).plusMonths(propuesta.getVigenciaMeses()))
                .build();
        Poliza guardada = polizaRepository.save(poliza);

        cuotaService.generarCuotasParaPoliza(guardada);
        return guardada;
    }

    @Transactional
    public List<PolizaBeneficiarioResponse> designarBeneficiarios(Usuario usuario, Integer idPoliza,
                                                                  DesignarBeneficiariosRequest request) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        validarSumaPorcentajes(request.beneficiarios());
        polizaBeneficiarioRepository.deleteByPoliza(poliza);
        List<PolizaBeneficiarioResponse> resultado = new java.util.ArrayList<>();
        for (var b : request.beneficiarios()) {
            Beneficiario catalogo = b.idBeneficiario() != null
                    ? beneficiarioRepository.findById(b.idBeneficiario()).orElse(null)
                    : null;
            PolizaBeneficiario pb = PolizaBeneficiario.builder()
                    .poliza(poliza)
                    .beneficiario(catalogo)
                    .nombres(b.nombres())
                    .apellidos(b.apellidos())
                    .parentesco(b.parentesco())
                    .documentoIdentidad(b.documentoIdentidad())
                    .porcentaje(b.porcentaje())
                    .build();
            resultado.add(PolizaBeneficiarioResponse.from(polizaBeneficiarioRepository.save(pb)));
        }
        return resultado;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> datosRiesgoDe(Usuario usuario, Integer idPoliza) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        if (poliza.getPropuesta() == null) return Map.of();
        LeadCotizacion lead = poliza.getPropuesta().getCotizacion();
        return evaluacionService.buscarPorCotizacion(lead)
                .map(EvaluacionRiesgo::getDatosRiesgo)
                .map(this::parseMap)
                .orElseGet(Map::of);
    }

    @Transactional
    public PolizaResponse cambiarEstado(Integer id, CambioEstadoPolizaRequest request) {
        Poliza poliza = polizaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", id));
        poliza.setEstadoPoliza(request.estadoPoliza());
        return PolizaResponse.from(polizaRepository.save(poliza));
    }

    @Transactional(readOnly = true)
    public List<PolizaResponse> renovaciones(int diasAdelante) {
        LocalDate hoy = LocalDate.now();
        LocalDate hasta = hoy.plusDays(diasAdelante);
        return polizaRepository.findByVigenciaFinBetweenAndEstadoPolizaOrderByVigenciaFinAsc(
                hoy, hasta, Poliza.EstadoPoliza.ACTIVA
        ).stream().map(PolizaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Poliza obtenerEntidadPropia(Usuario usuario, Integer idPoliza) {
        return obtenerPropia(usuario, idPoliza);
    }

    @Transactional(readOnly = true)
    public String generarContrato(Usuario usuario, Integer idPoliza) {
        Poliza poliza = obtenerPropia(usuario, idPoliza);
        var cliente = poliza.getCliente();
        var persona = cliente.getPersona();
        var producto = poliza.getProducto();

        StringBuilder sb = new StringBuilder();
        sb.append("==============================================================\n");
        sb.append("  CONTRATO DE POLIZA - SERENA SEGUROS\n");
        sb.append("==============================================================\n\n");
        sb.append("Numero de poliza: POL-").append(String.format("%06d", poliza.getIdPoliza())).append("\n");
        sb.append("Fecha de emision: ").append(poliza.getFechaEmision()).append("\n");
        sb.append("Estado: ").append(poliza.getEstadoPoliza().name()).append("\n\n");

        sb.append("-------------------- DATOS DEL ASEGURADO --------------------\n");
        sb.append("Nombres: ").append(persona.getNombres()).append(" ").append(persona.getApellidos()).append("\n");
        sb.append("Documento: ").append(persona.getDocumentoIdentidad()).append("\n");
        sb.append("Email: ").append(persona.getEmail()).append("\n");
        sb.append("Telefono: ").append(persona.getTelefono() != null ? persona.getTelefono() : "-").append("\n\n");

        sb.append("-------------------- PRODUCTO CONTRATADO --------------------\n");
        sb.append("Producto: ").append(producto.getNombre()).append("\n");
        sb.append("Tipo: ").append(producto.getTipoSeguro().name()).append("\n");
        sb.append("Prima total: S/ ").append(poliza.getPrimaTotal()).append("\n");
        if (poliza.getSumaAsegurada() != null) {
            sb.append("Suma asegurada: S/ ").append(poliza.getSumaAsegurada()).append("\n");
        }
        if (poliza.getDeducible() != null) {
            sb.append("Deducible: S/ ").append(poliza.getDeducible()).append("\n");
        }
        sb.append("Vigencia: ").append(poliza.getVigenciaInicio()).append(" a ").append(poliza.getVigenciaFin()).append("\n\n");

        sb.append("------------------------ BENEFICIARIOS ----------------------\n");
        var beneficiarios = polizaBeneficiarioRepository.findByPoliza(poliza);
        if (beneficiarios.isEmpty()) {
            sb.append("Sin beneficiarios registrados\n");
        } else {
            beneficiarios.forEach(b -> sb.append("- ")
                    .append(b.getNombres()).append(" ").append(b.getApellidos())
                    .append(" (").append(b.getParentesco()).append(") ")
                    .append(b.getPorcentaje()).append("%\n"));
        }
        sb.append("\n");

        sb.append("------------------------ PAGOS / CUOTAS ---------------------\n");
        var cuotas = cuotaRepository.findByPolizaOrderByNumeroCuotaAsc(poliza);
        cuotas.forEach(c -> sb.append("Cuota ").append(c.getNumeroCuota())
                .append(" - Vence: ").append(c.getFechaVencimiento())
                .append(" - S/ ").append(c.getMonto())
                .append(" - ").append(c.getEstadoPago().name()).append("\n"));

        sb.append("\n==============================================================\n");
        sb.append("Documento generado automaticamente por Serena Seguros.\n");
        sb.append("==============================================================\n");
        return sb.toString();
    }

    private PolizaDetalleResponse aDetalle(Poliza poliza) {
        List<EndosoResponse> endosos = endosoRepository
                .findByPolizaOrderByFechaSolicitudDesc(poliza)
                .stream().map(EndosoResponse::from).toList();
        List<PolizaBeneficiarioResponse> beneficiarios = polizaBeneficiarioRepository
                .findByPoliza(poliza)
                .stream().map(PolizaBeneficiarioResponse::from).toList();
        List<CuotaMini> pagos = cuotaRepository
                .findByPolizaOrderByNumeroCuotaAsc(poliza)
                .stream()
                .map(this::aCuotaMini)
                .toList();
        List<DocumentoResponse> documentos = documentoService
                .listarPorReferencia("poliza", poliza.getIdPoliza());
        PropuestaResponse propuesta = poliza.getPropuesta() != null
                ? PropuestaResponse.from(poliza.getPropuesta())
                : null;
        return new PolizaDetalleResponse(
                poliza.getIdPoliza(),
                poliza.getEstadoPoliza().name(),
                poliza.getPrimaTotal(),
                poliza.getSumaAsegurada(),
                poliza.getDeducible(),
                poliza.getFrecuenciaPago() != null ? poliza.getFrecuenciaPago().name() : null,
                poliza.getNumeroCuotas(),
                poliza.getVigenciaInicio(),
                poliza.getVigenciaFin(),
                poliza.getFechaEmision(),
                poliza.getPolizaPadre() != null ? poliza.getPolizaPadre().getIdPoliza() : null,
                ProductoMini.from(poliza.getProducto()),
                propuesta,
                endosos,
                beneficiarios,
                pagos,
                documentos
        );
    }

    private CuotaMini aCuotaMini(Cuota c) {
        return new CuotaMini(
                c.getIdCuota(),
                c.getNumeroCuota(),
                c.getMonto(),
                c.getFechaVencimiento(),
                c.getEstadoPago().name()
        );
    }

    private Cliente clienteDelUsuario(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(clienteRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente del usuario", usuario.getIdUsuario()));
    }

    private Poliza obtenerPropia(Usuario usuario, Integer idPoliza) {
        Cliente cliente = clienteDelUsuario(usuario);
        Poliza poliza = polizaRepository.findById(idPoliza)
                .orElseThrow(() -> new RecursoNoEncontradoException("Poliza", idPoliza));
        if (!poliza.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new AccessDeniedException("La poliza no pertenece al usuario");
        }
        return poliza;
    }

    private void validarSumaPorcentajes(List<DesignarBeneficiariosRequest.Beneficiario> beneficiarios) {
        BigDecimal total = beneficiarios.stream()
                .map(DesignarBeneficiariosRequest.Beneficiario::porcentaje)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        if (total.compareTo(new BigDecimal("100.00")) != 0) {
            throw new IllegalArgumentException(
                    "La suma de porcentajes debe ser 100. Total recibido: " + total);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseMap(String json) {
        try {
            return MAPPER.readValue(json, Map.class);
        } catch (Exception ex) {
            return Map.of();
        }
    }
}
