package com.serena.shared.exception;

public class UsuarioYaExisteException extends RuntimeException {

    public UsuarioYaExisteException(String email) {
        super("El usuario con email " + email + " ya existe");
    }
}
