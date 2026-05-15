package com.serena.modules.finanzas.compras.service;

import com.serena.modules.finanzas.compras.dto.*;
import com.serena.modules.finanzas.compras.entity.OrdenCompra;
import com.serena.modules.finanzas.compras.entity.ProveedorInterno;
import com.serena.modules.finanzas.compras.entity.SolicitudCompra;
import com.serena.modules.finanzas.compras.repository.OrdenCompraRepository;
import com.serena.modules.finanzas.compras.repository.ProveedorInternoRepository;
import com.serena.modules.finanzas.compras.repository.SolicitudCompraRepository;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.soporte.auditoria.service.AuditoriaService;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComprasService {

    private final SolicitudCompraRepository solicitudRepo;
    private final ProveedorInternoRepository proveedorRepo;
    private final OrdenCompraRepository ordenRepo;
    private final EmpleadoRepository empleadoRepo;
    private final PersonaRepository personaRepo;
    private final AuditoriaService auditoria;

    // ---- Solicitudes ----
    @Transactional(readOnly = true)
    public List<SolicitudCompraResponse> listarSolicitudes(SolicitudCompra.Estado estado) {
        List<SolicitudCompra> lista = (estado != null)
                ? solicitudRepo.findByEstadoOrderByFechaSolicitudDesc(estado)
                : solicitudRepo.findAllByOrderByFechaSolicitudDesc();
        return lista.stream().map(SolicitudCompraResponse::from).toList();
    }

    @Transactional
    public SolicitudCompraResponse crearSolicitud(SolicitudCompraRequest request, Usuario usuario) {
        Empleado solicitante = usuario != null
                ? personaRepo.findByUsuario(usuario).flatMap(empleadoRepo::findByPersona).orElse(null)
                : null;
        SolicitudCompra s = SolicitudCompra.builder()
                .area(request.area())
                .producto(request.producto())
                .descripcion(request.descripcion())
                .montoEstimado(request.montoEstimado())
                .prioridad(request.prioridad() != null ? request.prioridad() : SolicitudCompra.Prioridad.MEDIA)
                .estado(SolicitudCompra.Estado.PENDIENTE)
                .empleadoSolicitante(solicitante)
                .build();
        s = solicitudRepo.save(s);
        auditoria.registrar("solicitud_compra_creada", "compras",
                "SOL-" + s.getIdSolicitud() + " · " + s.getProducto() + " · " + s.getMontoEstimado());
        return SolicitudCompraResponse.from(s);
    }

    @Transactional
    public SolicitudCompraResponse cambiarEstadoSolicitud(Integer id, CambioEstadoSolicitudRequest request) {
        SolicitudCompra s = solicitudRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud", id));
        s.setEstado(request.estado());
        auditoria.registrar("solicitud_compra_estado", "compras",
                "SOL-" + id + " -> " + request.estado().name());
        return SolicitudCompraResponse.from(solicitudRepo.save(s));
    }

    // ---- Proveedores internos ----
    @Transactional(readOnly = true)
    public List<ProveedorInternoResponse> listarProveedores(ProveedorInterno.Estado estado) {
        List<ProveedorInterno> lista = (estado != null)
                ? proveedorRepo.findByEstadoOrderByNombreAsc(estado)
                : proveedorRepo.findAllByOrderByNombreAsc();
        return lista.stream().map(ProveedorInternoResponse::from).toList();
    }

    @Transactional
    public ProveedorInternoResponse crearProveedor(ProveedorInternoRequest request) {
        ProveedorInterno p = ProveedorInterno.builder()
                .nombre(request.nombre())
                .ruc(request.ruc())
                .rubro(request.rubro())
                .contacto(request.contacto())
                .telefono(request.telefono())
                .email(request.email())
                .estado(request.estado() != null ? request.estado() : ProveedorInterno.Estado.ACTIVO)
                .build();
        return ProveedorInternoResponse.from(proveedorRepo.save(p));
    }

    // ---- Ordenes ----
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarOrdenes() {
        return ordenRepo.findAllByOrderByFechaEmisionDesc()
                .stream()
                .map(OrdenCompraResponse::from)
                .toList();
    }

    @Transactional
    public OrdenCompraResponse crearOrden(OrdenCompraRequest request) {
        SolicitudCompra solicitud = solicitudRepo.findById(request.idSolicitud())
                .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud", request.idSolicitud()));
        ProveedorInterno proveedor = proveedorRepo.findById(request.idProveedorInterno())
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor interno", request.idProveedorInterno()));

        OrdenCompra orden = OrdenCompra.builder()
                .solicitud(solicitud)
                .proveedor(proveedor)
                .montoTotal(request.montoTotal())
                .estado(OrdenCompra.Estado.EMITIDA)
                .build();
        orden = ordenRepo.save(orden);

        solicitud.setEstado(SolicitudCompra.Estado.COMPRADO);
        solicitudRepo.save(solicitud);

        auditoria.registrar("orden_compra_emitida", "compras",
                "OC-" + orden.getIdOrden() + " a " + proveedor.getNombre() + " · " + request.montoTotal());

        return OrdenCompraResponse.from(orden);
    }
}
