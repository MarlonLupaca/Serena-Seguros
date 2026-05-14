package com.serena.modules.seguridad.auth.repository;

import com.serena.modules.seguridad.auth.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByUsername(String username);

    boolean existsByUsername(String username);

    List<Usuario> findByPortalAccesoAndEstado(Usuario.PortalAcceso portalAcceso, Usuario.Estado estado);
}
