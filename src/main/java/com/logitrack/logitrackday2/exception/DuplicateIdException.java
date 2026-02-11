package com.logitrack.logitrackday2.exception;

public class DuplicateIdException extends RuntimeException {
    public DuplicateIdException() {
        super("Tracking Number is already in use by another shipment!");
    }
}