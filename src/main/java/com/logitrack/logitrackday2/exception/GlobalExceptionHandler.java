package com.logitrack.logitrackday2.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DriverNotFoundException.class)
    public ResponseEntity<Object> handleDriverNotFound(final DriverNotFoundException ex) {
        // We use LinkedHashMap to keep the order of fields in our JSON
        final Map<String, Object> errorBody = new LinkedHashMap<>();

        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.NOT_FOUND.value());
        errorBody.put("error", "Resource Not Found");
        errorBody.put("message", ex.getMessage());
        // Here we use the 'resourceId' we manually passed through the exception!
        errorBody.put("driverIdAttempted", ex.getResourceId());
        errorBody.put("suggestion", "Please verify the Driver ID and try again.");

        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateIdException.class)
    public ResponseEntity<String> handleDuplicateId(DuplicateIdException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
    @ExceptionHandler(InvalidShipmentStateException.class)
    public ResponseEntity<Object> handleInvalidState(final InvalidShipmentStateException ex) {
        final Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("error", "Workflow Violation");
        body.put("message", ex.getMessage());
        body.put("currentStatus", ex.getCurrentState());
        body.put("suggestion", "You can only assign drivers to PENDING or IN_TRANSIT shipments.");

        return new ResponseEntity<>(body, HttpStatus.UNPROCESSABLE_ENTITY); // 422 Error
    }
    @ExceptionHandler(InvalidTrackingNumberException.class)
    public ResponseEntity<Object> handleInvalidTracking(final InvalidTrackingNumberException ex) {
        final Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("error", "Bad Request - Validation Failed");
        body.put("message", ex.getMessage());
        body.put("receivedValue", ex.getInvalidValue());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}