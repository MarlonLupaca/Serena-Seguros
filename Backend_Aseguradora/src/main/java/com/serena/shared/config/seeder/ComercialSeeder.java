package com.serena.shared.config.seeder;

import com.serena.modules.seguridad.auth.repository.PersonaRepository;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import com.serena.modules.comercial.comisiones.entity.ComisionAgente;
import com.serena.modules.comercial.comisiones.repository.ComisionAgenteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.core.polizas.entity.Poliza;
import com.serena.modules.core.polizas.repository.PolizaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@Order(3) // Se ejecuta en tercer lugar, garantizando que ya existan pólizas y empleados
@RequiredArgsConstructor
public class ComercialSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PolizaRepository polizaRepository;
    private final ComisionAgenteRepository comisionRepository;

    @Override
    @Transactional
    public void run(String... args) {
        crearComisionesDemo();
    }

    private void crearComisionesDemo() {
        // 1. Buscamos al empleado comercial que creamos en el SeguridadSeeder (Paso 1)
        Empleado comercial = usuarioRepository.findByUsername("comercial_demo")
                .flatMap(u -> personaRepository.findByUsuario(u))
                .flatMap(p -> empleadoRepository.findByPersona(p))
                .orElse(null);

        if (comercial == null) return;

        // 2. Iteramos sobre las pólizas creadas en el CoreSeeder (Paso 2)
        polizaRepository.findAll().forEach(poliza -> {
            // Si ya tiene comisión asignada, la saltamos para no duplicar
            if (comisionRepository.findByPoliza(poliza).isPresent()) return;

            BigDecimal porcentaje = new BigDecimal("5.00");

            // Calculamos el monto: (PrimaTotal * 5) / 100
            BigDecimal monto = poliza.getPrimaTotal()
                    .multiply(porcentaje)
                    .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);

            // Si la póliza está activa la comisión ya está pagada, sino queda pendiente
            ComisionAgente.EstadoPago estado = poliza.getEstadoPoliza() == Poliza.EstadoPoliza.ACTIVA
                    ? ComisionAgente.EstadoPago.PAGADA
                    : ComisionAgente.EstadoPago.PENDIENTE;

            // Guardamos la comisión
            comisionRepository.save(ComisionAgente.builder()
                    .empleadoAgente(comercial)
                    .poliza(poliza)
                    .porcentaje(porcentaje)
                    .montoGenerado(monto)
                    .estadoPago(estado)
                    .build());
        });
    }
}