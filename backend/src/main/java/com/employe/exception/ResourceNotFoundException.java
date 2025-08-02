package com.employe.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Optional additional constructors
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}