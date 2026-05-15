package com.serena.modules.seguridad.perfil.dto;

import jakarta.validation.constraints.NotNull;

public record PreferenciaRequest(
        @NotNull Boolean notifEmail,
        @NotNull Boolean notifSms,
        @NotNull Boolean notifPush
) {}
