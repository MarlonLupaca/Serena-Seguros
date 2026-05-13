package com.serena.modules.auth.dto.request;

import com.serena.modules.auth.entity.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegistroRequest(

        @NotBlank(message = "El username es obligatorio")
        @Size(min = 3, max = 50)
        String username,

        @NotBlank(message = "La contrasena es obligatoria")
        @Size(min = 8, message = "Minimo 8 caracteres")
        String password,

        @NotBlank(message = "Los nombres son obligatorios")
        @Size(max = 100)
        String nombres,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100)
        String apellidos,

        @NotBlank(message = "El documento es obligatorio")
        @Size(max = 20)
        String documentoIdentidad,

        @Size(max = 20)
        String telefono,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Email invalido")
        @Size(max = 100)
        String email,

        @NotNull(message = "El portal de acceso es obligatorio")
        Usuario.PortalAcceso portalAcceso

) {}
