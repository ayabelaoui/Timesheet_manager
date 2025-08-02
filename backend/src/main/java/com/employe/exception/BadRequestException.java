package com.employe.exception;

public class BadRequestException extends RuntimeException {
    // Proper constructor with return type (implicit for constructors)
    public BadRequestException(String message) {
        super(message);
    }

    // Optional additional constructors
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }

}