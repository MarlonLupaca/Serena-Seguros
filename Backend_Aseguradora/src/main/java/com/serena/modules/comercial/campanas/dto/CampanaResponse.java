package com.serena.modules.comercial.campanas.dto;

import com.serena.modules.comercial.campanas.entity.CampanaMarketing;

import java.time.LocalDateTime;

public record CampanaResponse(
        Integer idCampana,
        String agente,
        String asunto,
        String plantilla,
        Integer enviados,
        Integer abiertos,
        LocalDateTime fechaCreacion
) {
    public static CampanaResponse from(CampanaMarketing c) {
        var p = c.getEmpleadoAgente().getPersona();
        return new CampanaResponse(
                c.getIdCampana(),
                p.getNombres() + " " + p.getApellidos(),
                c.getAsunto(),
                c.getPlantilla(),
                c.getEnviados(),
                c.getAbiertos(),
                c.getFechaCreacion()
        );
    }
}
