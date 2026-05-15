package com.serena.modules.seguridad.perfil.repository;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.perfil.entity.PreferenciaNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferenciaNotificacionRepository extends JpaRepository<PreferenciaNotificacion, Integer> {

    Optional<PreferenciaNotificacion> findByUsuario(Usuario usuario);
}
