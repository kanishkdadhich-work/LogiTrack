package com.logitrack.logitrackday2.controller;

import com.logitrack.logitrackday2.entity.Shipment;
import com.logitrack.logitrackday2.service.ShipmentInterface;
import com.logitrack.logitrackday2.service.ShipmentService;
import com.logitrack.logitrackday2.repository.AppStatusRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor; // 🪄 Lombok magic
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor // Automatically creates the constructor for final fields 🏗️
public class HealthController {

    private final AppStatusRepository appStatusRepository;
    private final ShipmentService shipmentService;

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World! LogiTrack is ready for action.";
    }

    @GetMapping("/health")
    public boolean checkHealth() {
        return appStatusRepository.existsById(1L);
    }

    /**
     * 📦 Shipment Endpoints
     */
    @GetMapping("/shipments")
    public List<ShipmentInterface> getAll() {
        return shipmentService.getAll();
    }

    @PostMapping("/shipments")
    public ShipmentInterface create(@Valid @RequestBody Shipment shipment) {
        // This will now trigger the driver validation logic in the service! 🛡️
        return shipmentService.save(shipment);
    }

    @GetMapping("/shipments/{trackingNo}")
    public ShipmentInterface getByTracking(@PathVariable String trackingNo) {
        return shipmentService.getByTracking(trackingNo);
    }

    @GetMapping("/shipments/id/{id}")
    public ShipmentInterface getById(@PathVariable Long id) {
        return shipmentService.getById(id);
    }

    @PutMapping("/shipments/{id}")
    public ShipmentInterface update(@PathVariable Long id, @Valid @RequestBody Shipment shipment) {
        return shipmentService.update(id, shipment);
    }


    @DeleteMapping("/shipments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String delete(@PathVariable Long id) {
        shipmentService.delete(id);
        return "Shipment with ID " + id + " has been successfully deleted. 🗑️";
    }
    @PutMapping("/shipments/track/{trackingNo}")
    public ShipmentInterface updateByTracking(

            @PathVariable String trackingNo,

            @Valid @RequestBody Shipment shipment) {
        // Pass the tracking number to the service to locate the record
        System.out.println("Authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        return shipmentService.updateByTracking(trackingNo, shipment);


    }

    @DeleteMapping("/shipments/tracking/{trackingNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteByTrackingNumber(@PathVariable String trackingNumber) {
        shipmentService.deleteByTrackingNumber(trackingNumber);
        return ResponseEntity.ok("Shipment " + trackingNumber + " successfully removed from system. 🗑️");
    }

    @GetMapping("/shipments/my-shipments")
    public List<ShipmentInterface> getMyShipments() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return shipmentService.getMyAssignedShipments(username).stream()
                .map(s -> (ShipmentInterface) s)
                .toList();
    }
}