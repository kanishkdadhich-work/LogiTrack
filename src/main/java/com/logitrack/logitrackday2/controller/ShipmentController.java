package com.logitrack.logitrackday2.controller;

import com.logitrack.logitrackday2.entity.Driver;
import com.logitrack.logitrackday2.repository.ShipmentDriverView;
import com.logitrack.logitrackday2.repository.ShipmentRepository;
import com.logitrack.logitrackday2.service.ShipmentInterface;
import com.logitrack.logitrackday2.service.ShipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tables")
public class ShipmentController {

    private final ShipmentService shipmentService;

    // Constructor Injection for both dependencies
    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;

    }

    @GetMapping("/with-drivers")
    public List<ShipmentDriverView> getShipmentsWithDrivers() {
        return shipmentService.getAllWithDrivers();
    }
    @GetMapping("/test-driver/{id}")
    public Driver testManualDriver(@PathVariable Long id) { // Updated return type to Driver
        // Now the Controller and Service are "speaking the same language"
        return shipmentService.getDriverManually(id);
    }

    @PutMapping("/{shipmentId}/assign-driver/{driverId}")
    public ResponseEntity<String> assignDriver(
            @PathVariable Long shipmentId,
            @PathVariable Long driverId) {

        String message = shipmentService.assignDriverManual(shipmentId, driverId);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/tracking/{trackingNumber}/assign-driver/{driverId}")
    public ResponseEntity<String> assignByTracking(
            @PathVariable String trackingNumber,
            @PathVariable Long driverId) {

        String result = shipmentService.assignDriverByTracking(trackingNumber, driverId);
        return ResponseEntity.ok(result);
    }

}