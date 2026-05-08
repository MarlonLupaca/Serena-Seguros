package com.serena.modules.auth.repository;

import com.serena.modules.auth.entity.Persona;
import com.serena.modules.auth.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {

    boolean existsByEmail(String email);

    boolean existsByDocumentoIdentidad(String documentoIdentidad);

    Optional<Persona> findByUsuario(Usuario usuario);
}
