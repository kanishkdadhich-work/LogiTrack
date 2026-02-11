package com.logitrack.logitrackday2.exception;

import lombok.Getter;

@Getter
public class InvalidShipmentStateException extends RuntimeException {
    private final String currentState;

    public InvalidShipmentStateException(String message, String currentState) {
        super(message);
        this.currentState = currentState;
    }

}