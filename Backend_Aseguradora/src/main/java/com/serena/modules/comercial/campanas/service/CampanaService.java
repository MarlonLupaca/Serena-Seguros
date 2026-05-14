package com.serena.modules.comercial.campanas.service;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.comercial.campanas.dto.CampanaResponse;
import com.serena.modules.comercial.campanas.dto.CrearCampanaRequest;
import com.serena.modules.comercial.campanas.dto.RegistroEnvioRequest;
import com.serena.modules.comercial.campanas.entity.CampanaMarketing;
import com.serena.modules.comercial.campanas.repository.CampanaMarketingRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.shared.exception.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampanaService {

    private final CampanaMarketingRepository campanaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public List<CampanaResponse> misCampanas(Usuario usuario) {
        Empleado empleado = empleadoActual(usuario);
        return campanaRepository.findByEmpleadoAgenteOrderByFechaCreacionDesc(empleado)
                .stream().map(CampanaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CampanaResponse obtener(Usuario usuario, Integer id) {
        CampanaMarketing c = buscar(id);
        validarPropiedad(c, usuario);
        return CampanaResponse.from(c);
    }

    @Transactional
    public CampanaResponse crear(Usuario usuario, CrearCampanaRequest request) {
        Empleado empleado = empleadoActual(usuario);
        CampanaMarketing c = CampanaMarketing.builder()
                .empleadoAgente(empleado)
                .asunto(request.asunto())
                .plantilla(request.plantilla())
                .enviados(0)
                .abiertos(0)
                .build();
        return CampanaResponse.from(campanaRepository.save(c));
    }

    @Transactional
    public CampanaResponse registrarEnvio(Usuario usuario, Integer id, RegistroEnvioRequest request) {
        CampanaMarketing c = buscar(id);
        validarPropiedad(c, usuario);
        c.setEnviados(c.getEnviados() + request.enviados());
        if (request.abiertos() != null) {
            c.setAbiertos(c.getAbiertos() + request.abiertos());
        }
        return CampanaResponse.from(campanaRepository.save(c));
    }

    private CampanaMarketing buscar(Integer id) {
        return campanaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Campana", id));
    }

    private void validarPropiedad(CampanaMarketing c, Usuario usuario) {
        Empleado empleado = empleadoActual(usuario);
        if (!c.getEmpleadoAgente().getIdEmpleado().equals(empleado.getIdEmpleado())) {
            throw new AccessDeniedException("La campana no pertenece al usuario");
        }
    }

    private Empleado empleadoActual(Usuario usuario) {
        return personaRepository.findByUsuario(usuario)
                .flatMap(empleadoRepository::findByPersona)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado del usuario", usuario.getIdUsuario()));
    }
}
