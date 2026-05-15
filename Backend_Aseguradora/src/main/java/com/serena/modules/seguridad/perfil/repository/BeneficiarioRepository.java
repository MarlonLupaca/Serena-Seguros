package com.serena.modules.seguridad.perfil.repository;

import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.perfil.entity.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BeneficiarioRepository extends JpaRepository<Beneficiario, Integer> {

    List<Beneficiario> findByPersonaOrderByIdBeneficiarioAsc(Persona persona);

    void deleteByPersona(Persona persona);
}
