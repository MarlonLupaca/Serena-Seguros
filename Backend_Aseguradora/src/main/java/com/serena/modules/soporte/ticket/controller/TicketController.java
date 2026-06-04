package com.serena.modules.soporte.ticket.controller;

import com.serena.modules.soporte.ticket.dto.TicketRequestDTO;
import com.serena.modules.soporte.ticket.dto.TicketResponseDTO;
import com.serena.modules.soporte.ticket.service.TicketService;
import com.serena.modules.soporte.ticket.service.JiraIntegrationService;
import com.serena.modules.seguridad.auth.entity.Usuario;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/soporte/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final JiraIntegrationService jiraIntegrationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearTicket(@Valid @RequestBody TicketRequestDTO dto) {
        Map<String, Object> response = ticketService.crearTicket(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<TicketResponseDTO>> obtenerMisTickets(@AuthenticationPrincipal Usuario usuario) {
        String username = usuario.getUsername();
        String jsonResponse = jiraIntegrationService.searchTicketsByUser(username);
        
        List<TicketResponseDTO> tickets = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            JsonNode issues = root.path("issues");
            
            if (issues.isArray()) {
                for (JsonNode issue : issues) {
                    JsonNode fields = issue.path("fields");
                    tickets.add(TicketResponseDTO.builder()
                            .ticketId(issue.path("key").asText())
                            .asunto(fields.path("summary").asText())
                            .estado(fields.path("status").path("name").asText())
                            .fecha(fields.path("created").asText())
                            .build());
                }
            }
        } catch (Exception e) {
            log.error("Error parseando JSON de Jira para el usuario {}", username, e);
        }
        
        return ResponseEntity.ok(tickets);
    }
}
