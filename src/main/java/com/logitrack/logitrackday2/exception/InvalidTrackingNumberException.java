package com.logitrack.logitrackday2.exception;

public class InvalidTrackingNumberException extends RuntimeException {
    private final String invalidValue;

    public InvalidTrackingNumberException(String message, String invalidValue) {
        super(message);
        this.invalidValue = invalidValue;
    }

    public String getInvalidValue() { return invalidValue; }
}