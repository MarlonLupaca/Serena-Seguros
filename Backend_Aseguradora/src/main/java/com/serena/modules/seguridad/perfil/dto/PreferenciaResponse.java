package com.serena.modules.seguridad.perfil.dto;

import com.serena.modules.seguridad.perfil.entity.PreferenciaNotificacion;

public record PreferenciaResponse(
        Boolean notifEmail,
        Boolean notifSms,
        Boolean notifPush
) {
    public static PreferenciaResponse from(PreferenciaNotificacion p) {
        return new PreferenciaResponse(
                p.getNotifEmail(),
                p.getNotifSms(),
                p.getNotifPush()
        );
    }

    public static PreferenciaResponse defaultPreference() {
        return new PreferenciaResponse(true, false, true);
    }
}
