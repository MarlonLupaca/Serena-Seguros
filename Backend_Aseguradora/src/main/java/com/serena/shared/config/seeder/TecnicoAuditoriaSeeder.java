package com.serena.shared.config.seeder;

import com.serena.modules.soporte.auditoria.repository.AuditoriaRepository;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.repository.NotificacionRepository;
import com.serena.modules.soporte.auditoria.entity.AuditoriaAccion;
import com.serena.modules.tecnico.proveedores.entity.ProveedorRed;
import com.serena.modules.tecnico.proveedores.repository.ProveedorRedRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Order(6)
@RequiredArgsConstructor
public class TecnicoAuditoriaSeeder implements CommandLineRunner {

    private final ProveedorRedRepository proveedorRepository;
    private final SiniestroRepository siniestroRepository;
    private final AuditoriaRepository auditoriaRepository;
    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final PolizaRepository polizaRepository;

    @Override
    public void run(String... args) {
        crearProveedores();     // Tabla 18: proveedor_red
        crearSiniestros();      // Tabla 19 y 20: siniestro y siniestro_proveedor
        crearAuditoria();       // Tabla 21: auditoria_accion
        crearNotificaciones();  // Tabla 22: notificacion
        // Tabla 23: documento_auditoria (puedes añadirla si manejas archivos)
    }

    private void crearProveedores() {
        if (proveedorRepository.count() == 0) {
            String[][] datos = {
                    {"CLINICA", "Clínica San Pablo", "Arequipa"},
                    {"TALLER",  "Sur Motors",        "Arequipa"},
                    {"GRUA",    "Auxilio Rápido",    "Lima"},
                    {"CLINICA", "Clínica Delgado",   "Lima"},
                    {"TALLER",  "Mecánica Pro",      "Arequipa"}
            };
            for (String[] d : datos) {
                proveedorRepository.save(ProveedorRed.builder()
                        .rubro(ProveedorRed.Rubro.valueOf(d[0]))
                        .nombre(d[1])
                        .ciudad(d[2])
                        .estado(ProveedorRed.Estado.ACTIVO)
                        .build());
            }
        }
    }

    private void crearSiniestros() {
        if (siniestroRepository.count() == 0) {
            polizaRepository.findAll().stream().limit(5).forEach(poliza -> {
                siniestroRepository.save(Siniestro.builder()
                        .poliza(poliza)
                        .tipoIncidente("Choque o Incidente Menor")
                        .descripcion("Reporte de prueba generado por el sistema")
                        .fechaOcurrencia(LocalDate.now().minusDays(5))
                        .estadoResolucion(Siniestro.EstadoResolucion.REPORTADO)
                        .montoReclamado(new BigDecimal("1500.00"))
                        .build());
            });
        }
    }

    private void crearAuditoria() {
        if (auditoriaRepository.count() == 0) {
            String[] acciones = {"LOGIN", "CREAR_POLIZA", "APROBAR_PAGO", "DESCARGAR_DOC", "LOGOUT"};
            for (String acc : acciones) {
                auditoriaRepository.save(AuditoriaAccion.builder()
                        .username("admin_demo")
                        .accion(acc)
                        .modulo("SISTEMA")
                        .detalle("Acción de auditoría automática")
                        .fecha(LocalDateTime.now())
                        .build());
            }
        }
    }

    private void crearNotificaciones() {
        if (notificacionRepository.count() == 0) {
            usuarioRepository.findAll().stream().limit(5).forEach(user -> {
                notificacionRepository.save(Notificacion.builder()
                        .usuario(user)
                        .titulo("Bienvenido al Sistema")
                        .mensaje("Su cuenta ha sido configurada correctamente.")
                        .tipo(Notificacion.Tipo.GENERAL)
                        .leida(false)
                        .fecha(LocalDateTime.now())
                        .build());
            });
        }
    }
}