package com.serena.modules.soporte.ticket.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class JiraIntegrationService {

    @Value("${app.jira.url}")
    private String jiraUrl;

    @Value("${app.jira.username}")
    private String jiraUsername;

    @Value("${app.jira.token}")
    private String jiraToken;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    private String getAuthHeader() {
        String auth = jiraUsername + ":" + jiraToken;
        return "Basic " + Base64.getEncoder().encodeToString(auth.getBytes());
    }

    public String createTicket(String requestTypeId, String summary, String description,
                               String usuario, String areaCargo, String justificacionNegocio,
                               String urgenciaId, String impactoId) {
        try {
            Map<String, Object> requestFieldValues = new HashMap<>();
            requestFieldValues.put("summary", summary);
            requestFieldValues.put("description", description);
            requestFieldValues.put("customfield_10088", usuario);
            
            if (areaCargo != null && !areaCargo.isBlank()) {
                requestFieldValues.put("customfield_10089", areaCargo);
            }
            if (justificacionNegocio != null && !justificacionNegocio.isBlank()) {
                requestFieldValues.put("customfield_10090", justificacionNegocio);
            }

            requestFieldValues.put("customfield_10004", Map.of("id", impactoId));
            requestFieldValues.put("customfield_10050", Map.of("id", urgenciaId));

            Map<String, Object> payload = new HashMap<>();
            payload.put("serviceDeskId", "1");
            payload.put("requestTypeId", requestTypeId);
            payload.put("requestFieldValues", requestFieldValues);

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(jiraUrl + "/rest/servicedeskapi/request"))
                    .header("Authorization", getAuthHeader())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201 || response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                return root.path("issueKey").asText();
            } else {
                log.error("Error creando ticket en Jira. Status: {}. Response: {}", response.statusCode(), response.body());
                throw new RuntimeException("Error al comunicarse con Jira: " + response.statusCode());
            }

        } catch (Exception e) {
            log.error("Excepción al crear ticket en Jira", e);
            throw new RuntimeException("Error interno al crear el ticket de soporte", e);
        }
    }

    public String searchTicketsByUser(String usuario) {
        try {
            // Usamos las comillas exactas que funcionan en Postman
            String jql = "project = HELP AND cf[10088] ~ \"" + usuario + "\" ORDER BY created DESC";
            Map<String, Object> payload = new HashMap<>();
            payload.put("jql", jql);
            payload.put("maxResults", 50);
            payload.put("fields", new String[]{"summary", "status", "created", "customfield_10088"});

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(jiraUrl + "/rest/api/3/search/jql"))
                    .header("Authorization", getAuthHeader())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return response.body();
            } else {
                log.error("Error buscando tickets. Status: {}. Response: {}", response.statusCode(), response.body());
                return "{\"issues\": []}"; // Devuelve JSON vacío en vez de fallar
            }
        } catch (Exception e) {
            log.error("Excepción al buscar tickets en Jira", e);
            return "{\"issues\": []}";
        }
    }
}
