package com.serena.modules.comisiones.service;

import com.serena.modules.auth.entity.Usuario;
import com.serena.modules.auth.repository.PersonaRepository;
import com.serena.modules.comisiones.dto.ComisionResponse;
import com.serena.modules.comisiones.entity.ComisionAgente;
import com.serena.modules.comisiones.repository.ComisionAgenteRepository;
import com.serena.modules.empleados.entity.Empleado;
import com.serena.modules.empleados.repository.EmpleadoRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComisionService {

    private final ComisionAgenteRepository comisionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public List<ComisionResponse> misComisiones(Usuario usuario, ComisionAgente.EstadoPago estado) {
        Empleado empleado = empleadoActual(usuario);
        List<ComisionAgente> lista = (estado != null)
                ? comisionRepository.findByEmpleadoAgenteAndEstadoPagoOrderByIdComisionDesc(empleado, estado)
                : comisionRepository.findByEmpleadoAgenteOrderByIdComisionDesc(empleado);
        return lista.stream().map(ComisionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarTodas() {
        return comisionRepository.findAllByOrderByIdComisionDesc()
                .stream().map(ComisionResponse::from).toList();
    }

    @Transactional
    public ComisionResponse pagar(Integer id) {
        ComisionAgente c = comisionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Comision", id));
        c.setEstadoPago(ComisionAgente.EstadoPago.PAGADA);
        return ComisionResponse.from(comisionRepository.save(c));
    }

    private Empleado empleadoActual(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(empleadoRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado del usuario", usuario.getIdUsuario()));
    }
}
