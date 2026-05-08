package com.serena.modules.cotizaciones.service;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.cotizaciones.dto.CotizacionResponse;
import com.serena.modules.cotizaciones.dto.CrearCotizacionRequest;
import com.serena.modules.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.empleados.repository.EmpleadoRepository;
import com.serena.modules.productos.entity.ProductoSeguro;
import com.serena.modules.productos.repository.ProductoSeguroRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CotizacionService {

    private final LeadCotizacionRepository cotizacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ProductoSeguroRepository productoRepository;

    @Transactional
    public CotizacionResponse crear(Usuario usuario, CrearCotizacionRequest request) {
        Empleado agente = empleadoRepository.findAll().stream()
                .filter(e -> "COMERCIAL".equalsIgnoreCase(e.getArea()))
                .findFirst()
                .or(() -> empleadoRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Empleado disponible para asignar cotizacion", 0));

        BigDecimal prima = request.primaEstimada();
        if (prima == null && request.idProducto() != null) {
            ProductoSeguro p = productoRepository.findById(request.idProducto()).orElse(null);
            if (p != null) prima = p.getPrimaBase();
        }

        LeadCotizacion lead = LeadCotizacion.builder()
                .empleadoAgente(agente)
                .productoInteres(request.productoInteres())
                .estadoKanban(LeadCotizacion.EstadoKanban.NUEVO)
                .primaEstimada(prima)
                .build();
        return CotizacionResponse.from(cotizacionRepository.save(lead));
    }
}
