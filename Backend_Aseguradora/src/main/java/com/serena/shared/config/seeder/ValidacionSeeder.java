package com.serena.shared.config.seeder;

import com.serena.modules.seguridad.clientes.entity.Cliente;
import com.serena.modules.seguridad.clientes.repository.ClienteRepository;
import com.serena.modules.seguridad.empleados.entity.Empleado;
import com.serena.modules.seguridad.empleados.repository.EmpleadoRepository;
import com.serena.modules.tecnico.validaciones.entity.ValidacionDocumental;
import com.serena.modules.tecnico.validaciones.repository.ValidacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(8)
@RequiredArgsConstructor
public class ValidacionSeeder implements CommandLineRunner {

    private final ValidacionRepository validacionRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (validacionRepository.count() >= 5) return;

        List<Cliente> clientes = clienteRepository.findAll();
        if (clientes.isEmpty()) return;

        Empleado validador = empleadoRepository.findAll().stream()
                .filter(e -> "TECNICO".equalsIgnoreCase(e.getArea()))
                .findFirst()
                .orElse(empleadoRepository.findAll().stream().findFirst().orElse(null));

        // 5 validaciones cubriendo los 4 estados
        crear(clientes.get(0), null, ValidacionDocumental.Estado.PENDIENTE, null);
        crear(clientes.get(Math.min(1, clientes.size() - 1)), null, ValidacionDocumental.Estado.PENDIENTE, null);
        crear(clientes.get(0), validador, ValidacionDocumental.Estado.APROBADO, null);
        crear(clientes.get(Math.min(1, clientes.size() - 1)), validador,
                ValidacionDocumental.Estado.RECHAZADO,
                "El DNI cargado esta vencido. Solicitar version vigente.");
        crear(clientes.get(0), validador,
                ValidacionDocumental.Estado.CORRECCION,
                "La foto del documento esta borrosa. Por favor reenviar.");
    }

    private void crear(Cliente cliente, Empleado validador, ValidacionDocumental.Estado estado, String motivo) {
        LocalDateTime fechaResolucion = estado == ValidacionDocumental.Estado.PENDIENTE
                ? null
                : LocalDateTime.now().minusHours(2);
        validacionRepository.save(ValidacionDocumental.builder()
                .cliente(cliente)
                .estado(estado)
                .motivoRechazo(motivo)
                .empleadoValidador(estado == ValidacionDocumental.Estado.PENDIENTE ? null : validador)
                .fechaResolucion(fechaResolucion)
                .build());
    }
}
