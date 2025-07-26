package com.employe;

public class DuplicateEmailException extends RuntimeException {
    private final String duplicateValue;
    private final String fieldName;

    public DuplicateEmailException(String message, String fieldName, String duplicateValue) {
        super(message);
        this.fieldName = fieldName;
        this.duplicateValue = duplicateValue;
    }

    // Getters
    public String getDuplicateValue() {
        return duplicateValue;
    }

    public String getFieldName() {
        return fieldName;
    }
}