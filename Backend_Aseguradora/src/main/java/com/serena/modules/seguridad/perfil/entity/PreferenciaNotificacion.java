package com.serena.modules.seguridad.perfil.entity;

import com.serena.modules.seguridad.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "preferencia_notificacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenciaNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_preferencia")
    private Integer idPreferencia;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "notif_email", nullable = false)
    @Builder.Default
    private Boolean notifEmail = Boolean.TRUE;

    @Column(name = "notif_sms", nullable = false)
    @Builder.Default
    private Boolean notifSms = Boolean.FALSE;

    @Column(name = "notif_push", nullable = false)
    @Builder.Default
    private Boolean notifPush = Boolean.TRUE;
}
