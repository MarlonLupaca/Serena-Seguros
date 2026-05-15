package com.serena.modules.core.promociones.service;

import com.serena.modules.core.promociones.dto.PromocionResponse;
import com.serena.modules.core.promociones.repository.PromocionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromocionService {

    private final PromocionRepository promocionRepository;

    @Transactional(readOnly = true)
    public List<PromocionResponse> listarActivas() {
        return promocionRepository.findActivasVigentes(LocalDate.now())
                .stream()
                .map(PromocionResponse::from)
                .toList();
    }
}
