package com.serena.modules.comercial.cotizaciones.dto;

import jakarta.validation.constraints.AssertTrue;

public record AceptarPropuestaRequest(
        @AssertTrue(message = "Debe aceptar los terminos y condiciones") boolean aceptaTerminos,
        @AssertTrue(message = "Debe declarar la veracidad de la informacion") boolean declaracionVeraz
) {}
