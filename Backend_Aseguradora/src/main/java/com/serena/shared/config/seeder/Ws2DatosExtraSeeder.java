package com.serena.shared.config.seeder;

import com.serena.modules.comercial.campanas.entity.CampanaMarketing;
import com.serena.modules.comercial.campanas.repository.CampanaMarketingRepository;
import com.serena.modules.comercial.cotizaciones.entity.LeadCotizacion;
import com.serena.modules.comercial.cotizaciones.repository.LeadCotizacionRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import com.serena.modules.core.productos.repository.ProductoSeguroRepository;
import com.serena.modules.core.reaseguro.entity.Reaseguro;
import com.serena.modules.core.reaseguro.repository.ReaseguroRepository;
import com.serena.modules.seguridad.auth.entity.Persona;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.soporte.notificaciones.entity.Notificacion;
import com.serena.modules.soporte.notificaciones.repository.NotificacionRepository;
import com.serena.modules.tecnico.documentos.entity.DocumentoAuditoria;
import com.serena.modules.tecnico.documentos.repository.DocumentoAuditoriaRepository;
import com.serena.modules.tecnico.proveedores.repository.ProveedorRedRepository;
import com.serena.modules.tecnico.siniestros.entity.Siniestro;
import com.serena.modules.tecnico.siniestros.entity.SiniestroProveedor;
import com.serena.modules.tecnico.siniestros.entity.SiniestroProveedor.SiniestroProveedorId;
import com.serena.modules.tecnico.siniestros.repository.SiniestroProveedorRepository;
import com.serena.modules.tecnico.siniestros.repository.SiniestroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(10)
@RequiredArgsConstructor
public class Ws2DatosExtraSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PolizaRepository polizaRepository;
    private final ProductoSeguroRepository productoRepository;
    private final ReaseguroRepository reaseguroRepository;
    private final LeadCotizacionRepository leadRepository;
    private final CampanaMarketingRepository campanaRepository;
    private final SiniestroRepository siniestroRepository;
    private final SiniestroProveedorRepository siniestroProveedorRepository;
    private final ProveedorRedRepository proveedorRedRepository;
    private final DocumentoAuditoriaRepository documentoRepository;
    private final NotificacionRepository notificacionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        crearClientesExtras();
        crearEmpleadosExtras();
        crearPolizasExtras();
        crearReaseguros();
        crearLeads();
        crearCampanas();
        crearSiniestrosExtras();
        crearSiniestroProveedor();
        crearDocumentos();
        crearNotificacionesExtras();
    }

    // --- Clientes ---
    private void crearClientesExtras() {
        if (clienteRepository.count() >= 5) return;
        Object[][] datos = {
                {"asegurado2_demo", "Rosa", "Diaz Lopez", "10100001", "rosa.diaz@serena.com"},
                {"asegurado3_demo", "Manuel", "Vega Torres", "10100002", "manuel.vega@serena.com"},
                {"asegurado4_demo", "Lucia", "Reyes Soto", "10100003", "lucia.reyes@serena.com"},
                {"asegurado5_demo", "Carlos", "Mendoza Lima", "10100004", "carlos.mendoza@serena.com"},
        };
        for (Object[] d : datos) {
            crearClienteSiNoExiste((String) d[0], (String) d[1], (String) d[2], (String) d[3], (String) d[4]);
        }
    }

    private void crearClienteSiNoExiste(String username, String nombres, String apellidos, String doc, String email) {
        if (usuarioRepository.findByUsername(username).isPresent()) return;
        Usuario u = usuarioRepository.save(Usuario.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode("demo12345"))
                .portalAcceso(Usuario.PortalAcceso.ASEGURADO)
                .estado(Usuario.Estado.ACTIVO)
                .build());
        Persona p = personaRepository.save(Persona.builder()
                .usuario(u).nombres(nombres).apellidos(apellidos)
                .documentoIdentidad(doc).telefono("987" + doc.substring(3)).email(email)
                .build());
        clienteRepository.save(Cliente.builder()
                .persona(p).estadoCrm(Cliente.EstadoCrm.CLIENTE)
                .build());
    }

    // --- Empleados ---
    private void crearEmpleadosExtras() {
        if (empleadoRepository.count() >= 5) return;
        crearEmpleadoSiNoExiste("perito_demo", "Pedro", "Perito Quispe", "10200001",
                "perito@serena.com", "Perito senior", "TECNICO");
    }

    private void crearEmpleadoSiNoExiste(String username, String nombres, String apellidos, String doc,
                                          String email, String cargo, String area) {
        if (usuarioRepository.findByUsername(username).isPresent()) return;
        Usuario u = usuarioRepository.save(Usuario.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode("demo12345"))
                .portalAcceso(Usuario.PortalAcceso.TECNICO)
                .estado(Usuario.Estado.ACTIVO)
                .build());
        Persona p = personaRepository.save(Persona.builder()
                .usuario(u).nombres(nombres).apellidos(apellidos)
                .documentoIdentidad(doc).telefono("987000" + doc.substring(5)).email(email)
                .build());
        empleadoRepository.save(Empleado.builder()
                .persona(p).cargo(cargo).area(area)
                .sueldoBase(new BigDecimal("4500.00"))
                .fechaIngreso(LocalDate.now().minusYears(1))
                .estadoEmpleado(Empleado.EstadoEmpleado.ACTIVO)
                .build());
    }

    // --- Polizas ---
    private void crearPolizasExtras() {
        if (polizaRepository.count() >= 5) return;
        var clientes = clienteRepository.findAll();
        var productos = productoRepository.findAll();
        if (clientes.isEmpty() || productos.isEmpty()) return;

        int objetivo = 5;
        int idxCliente = 0;
        int idxProducto = 0;
        while (polizaRepository.count() < objetivo) {
            Cliente c = clientes.get(idxCliente % clientes.size());
            var prod = productos.get(idxProducto % productos.size());
            polizaRepository.save(Poliza.builder()
                    .cliente(c).producto(prod)
                    .primaTotal(prod.getPrimaBase().multiply(BigDecimal.valueOf(12)))
                    .estadoPoliza(Poliza.EstadoPoliza.ACTIVA)
                    .vigenciaInicio(LocalDate.now().minusMonths(idxProducto + 1))
                    .vigenciaFin(LocalDate.now().plusMonths(11 - idxProducto))
                    .build());
            idxCliente++;
            idxProducto++;
            if (idxCliente > 10) break; // salvaguarda
        }
    }

    // --- Reaseguros ---
    private void crearReaseguros() {
        if (reaseguroRepository.count() >= 5) return;
        var reaseguradoras = List.of("Mapfre Re", "Munich Re", "Swiss Re", "Hannover Re", "Scor SE");
        int i = 0;
        for (Poliza p : polizaRepository.findAll()) {
            if (reaseguroRepository.count() >= 5) break;
            BigDecimal cedido = p.getPrimaTotal().multiply(new BigDecimal("0.30"))
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal retenido = p.getPrimaTotal().subtract(cedido)
                    .setScale(2, RoundingMode.HALF_UP);
            reaseguroRepository.save(Reaseguro.builder()
                    .poliza(p)
                    .riesgoRetenido(retenido)
                    .riesgoCedido(cedido)
                    .reaseguradoraAsociada(reaseguradoras.get(i % reaseguradoras.size()))
                    .build());
            i++;
        }
    }

    // --- Leads ---
    private void crearLeads() {
        if (leadRepository.count() >= 5) return;
        Empleado agente = empleadoComercial();
        if (agente == null) return;

        var datos = new Object[][]{
                {LeadCotizacion.ProductoInteres.VEHICULAR, LeadCotizacion.EstadoKanban.NUEVO, "1200.00"},
                {LeadCotizacion.ProductoInteres.SALUD, LeadCotizacion.EstadoKanban.CONTACTADO, "1800.00"},
                {LeadCotizacion.ProductoInteres.HOGAR, LeadCotizacion.EstadoKanban.EN_PROPUESTA, "450.00"},
                {LeadCotizacion.ProductoInteres.VIDA, LeadCotizacion.EstadoKanban.NEGOCIACION, "900.00"},
                {LeadCotizacion.ProductoInteres.VIAJE, LeadCotizacion.EstadoKanban.GANADO, "150.00"},
                {LeadCotizacion.ProductoInteres.VEHICULAR, LeadCotizacion.EstadoKanban.PERDIDO, "1100.00"},
        };
        for (Object[] d : datos) {
            leadRepository.save(LeadCotizacion.builder()
                    .empleadoAgente(agente)
                    .productoInteres((LeadCotizacion.ProductoInteres) d[0])
                    .estadoKanban((LeadCotizacion.EstadoKanban) d[1])
                    .primaEstimada(new BigDecimal((String) d[2]))
                    .build());
        }
    }

    // --- Campañas ---
    private void crearCampanas() {
        if (campanaRepository.count() >= 5) return;
        Empleado agente = empleadoComercial();
        if (agente == null) return;

        Object[][] datos = {
                {"Renueva tu SOAT con 15% dscto", "Renueva antes del vencimiento y obten un descuento del 15%.", 320, 145},
                {"Salud familiar - mes gratis", "Contrata salud premium en familia y recibe un mes sin costo.", 280, 95},
                {"Vida + Ahorro = Tranquilidad", "Conoce nuestro plan de vida con ahorro respaldado.", 410, 180},
                {"Hogar protegido al 100%", "Cobertura total para tu casa y contenido. Aprovecha ahora.", 195, 60},
                {"Viaja seguro al exterior", "Cobertura internacional desde S/ 120.", 360, 210},
        };
        for (Object[] d : datos) {
            campanaRepository.save(CampanaMarketing.builder()
                    .empleadoAgente(agente)
                    .asunto((String) d[0])
                    .plantilla((String) d[1])
                    .enviados((Integer) d[2])
                    .abiertos((Integer) d[3])
                    .build());
        }
    }

    // --- Siniestros extras ---
    private void crearSiniestrosExtras() {
        if (siniestroRepository.count() >= 5) return;
        var polizas = polizaRepository.findAll();
        if (polizas.isEmpty()) return;

        Object[][] datos = {
                {"Robo total vehiculo", "Vehiculo sustraido en zona comercial",
                        Siniestro.EstadoResolucion.EN_REVISION, "18500.00", 10},
                {"Choque por alcance", "Daño en parachoques trasero",
                        Siniestro.EstadoResolucion.EN_EVALUACION, "3200.00", 6},
                {"Hospitalizacion", "Emergencia medica - apendicitis",
                        Siniestro.EstadoResolucion.APROBADO, "5400.00", 14},
                {"Incendio menor", "Daños por fuga de gas en cocina",
                        Siniestro.EstadoResolucion.FINALIZADO, "8900.00", 20},
                {"Daños a terceros", "Choque con motocicleta",
                        Siniestro.EstadoResolucion.RECHAZADO, "1200.00", 25},
        };
        int i = 0;
        for (Object[] d : datos) {
            if (siniestroRepository.count() >= 5) break;
            Poliza p = polizas.get(i % polizas.size());
            siniestroRepository.save(Siniestro.builder()
                    .poliza(p)
                    .tipoIncidente((String) d[0])
                    .descripcion((String) d[1])
                    .fechaOcurrencia(LocalDate.now().minusDays((Integer) d[4]))
                    .estadoResolucion((Siniestro.EstadoResolucion) d[2])
                    .montoReclamado(new BigDecimal((String) d[3]))
                    .build());
            i++;
        }
    }

    // --- Siniestro x Proveedor ---
    private void crearSiniestroProveedor() {
        if (siniestroProveedorRepository.count() >= 5) return;
        var siniestros = siniestroRepository.findAll();
        var proveedores = proveedorRedRepository.findAll();
        if (siniestros.isEmpty() || proveedores.isEmpty()) return;

        int i = 0;
        for (Siniestro s : siniestros) {
            if (siniestroProveedorRepository.count() >= 5) break;
            var prov = proveedores.get(i % proveedores.size());
            var id = SiniestroProveedorId.builder()
                    .idSiniestro(s.getIdSiniestro())
                    .idProveedor(prov.getIdProveedor())
                    .build();
            if (siniestroProveedorRepository.findById(id).isPresent()) {
                i++;
                continue;
            }
            siniestroProveedorRepository.save(SiniestroProveedor.builder()
                    .id(id).siniestro(s).proveedor(prov)
                    .costoServicio(new BigDecimal("850.00").add(new BigDecimal(i * 100)))
                    .fechaAsignacion(LocalDateTime.now().minusDays(i))
                    .build());
            i++;
        }
    }

    // --- Documentos ---
    private void crearDocumentos() {
        if (documentoRepository.count() >= 5) return;
        Usuario autor = usuarioRepository.findByUsername("ejecutivo_demo")
                .orElseGet(() -> usuarioRepository.findAll().stream().findFirst().orElse(null));
        if (autor == null) return;

        var siniestros = siniestroRepository.findAll();
        var polizas = polizaRepository.findAll();

        Object[][] datos = {
                {"siniestro", siniestros.isEmpty() ? 1 : siniestros.get(0).getIdSiniestro(),
                        "fotos/siniestro1_evidencia.jpg"},
                {"siniestro", siniestros.size() > 1 ? siniestros.get(1).getIdSiniestro() : 1,
                        "documentos/siniestro2_informe.pdf"},
                {"poliza", polizas.isEmpty() ? 1 : polizas.get(0).getIdPoliza(),
                        "contratos/poliza1_firmada.pdf"},
                {"poliza", polizas.size() > 1 ? polizas.get(1).getIdPoliza() : 1,
                        "contratos/poliza2_anexo.pdf"},
                {"cliente", 1, "identidad/cliente1_dni.jpg"},
        };
        for (Object[] d : datos) {
            documentoRepository.save(DocumentoAuditoria.builder()
                    .tablaReferencia((String) d[0])
                    .idReferencia((Integer) d[1])
                    .rutaArchivo((String) d[2])
                    .usuarioCreador(autor)
                    .build());
        }
    }

    // --- Notificaciones extras ---
    private void crearNotificacionesExtras() {
        usuarioRepository.findAll().forEach(u -> {
            long actuales = notificacionRepository.count();
            if (actuales >= 25) return;
            long existentesParaUsuario = notificacionRepository.findByUsuarioOrderByFechaDesc(u).size();
            int faltan = Math.max(0, 5 - (int) existentesParaUsuario);
            if (faltan == 0) return;

            String portal = u.getPortalAcceso().name();
            Object[][] base = {
                    {Notificacion.Tipo.GENERAL, "Bienvenido al portal " + portal,
                            "Tu cuenta esta activa. Explora las funcionalidades."},
                    {Notificacion.Tipo.COBRANZA, "Recordatorio de pagos pendientes",
                            "Revisa las cuotas por cobrar en el modulo de cobranza."},
                    {Notificacion.Tipo.APROBACION, "Aprobaciones por revisar",
                            "Hay solicitudes pendientes que requieren tu atencion."},
                    {Notificacion.Tipo.SINIESTRO, "Siniestros en curso",
                            "Tienes siniestros con seguimiento activo."},
                    {Notificacion.Tipo.COMISION, "Resumen de comisiones",
                            "Revisa el corte mensual de tus comisiones."},
            };
            for (int i = 0; i < faltan && i < base.length; i++) {
                notificacionRepository.save(Notificacion.builder()
                        .usuario(u)
                        .tipo((Notificacion.Tipo) base[i][0])
                        .titulo((String) base[i][1])
                        .mensaje((String) base[i][2])
                        .leida(false)
                        .build());
            }
        });
    }

    // --- helpers ---
    private Empleado empleadoComercial() {
        return empleadoRepository.findAll().stream()
                .filter(e -> "COMERCIAL".equalsIgnoreCase(e.getArea()))
                .findFirst()
                .orElse(empleadoRepository.findAll().stream().findFirst().orElse(null));
    }
}
