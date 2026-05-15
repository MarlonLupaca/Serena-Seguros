package com.serena.modules.tecnico.documentos.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentoStorage {

    @Value("${app.documentos.dir:uploads}")
    private String directorio;

    private Path raiz;

    @PostConstruct
    public void init() throws IOException {
        raiz = Paths.get(directorio).toAbsolutePath().normalize();
        Files.createDirectories(raiz);
    }

    public String guardar(MultipartFile archivo) throws IOException {
        String nombreOriginal = archivo.getOriginalFilename();
        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            nombreOriginal = "archivo";
        }
        String limpio = nombreOriginal.replaceAll("[^a-zA-Z0-9._-]", "_");
        String prefijo = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String nombreFinal = prefijo + "_" + limpio;
        Path destino = raiz.resolve(nombreFinal);
        Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        return nombreFinal;
    }

    public Resource leer(String nombreArchivo) throws MalformedURLException {
        Path archivo = raiz.resolve(nombreArchivo).normalize();
        if (!archivo.startsWith(raiz)) {
            throw new SecurityException("Ruta de archivo invalida");
        }
        return new UrlResource(archivo.toUri());
    }

    public void borrar(String nombreArchivo) {
        if (nombreArchivo == null || nombreArchivo.isBlank()) {
            return;
        }
        try {
            Path archivo = raiz.resolve(nombreArchivo).normalize();
            if (archivo.startsWith(raiz)) {
                Files.deleteIfExists(archivo);
            }
        } catch (IOException ignored) {
        }
    }
}
