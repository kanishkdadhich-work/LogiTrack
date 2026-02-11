package com.logitrack.logitrackday2.exception;

// We removed @ResponseStatus to handle it manually in the GlobalExceptionHandler
public class DriverNotFoundException extends RuntimeException {
    private final String resourceId; // Use 'final' for immutable error data

    public DriverNotFoundException(String message, String resourceId) {
        super(message);
        this.resourceId = resourceId;
    }

    public String getResourceId() {
        return resourceId;
    }
}