package com.serena.modules.perfil.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PerfilUpdateRequest(

        @NotBlank(message = "Los nombres son obligatorios")
        @Size(max = 100)
        String nombres,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100)
        String apellidos,

        @Size(max = 20)
        String telefono,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Email invalido")
        @Size(max = 100)
        String email

) {}
