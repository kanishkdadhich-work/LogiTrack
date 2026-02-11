package com.logitrack.logitrackday2.controller;

import com.logitrack.logitrackday2.entity.Shipment;
import com.logitrack.logitrackday2.service.ShipmentInterface;
import com.logitrack.logitrackday2.service.ShipmentService;
import com.logitrack.logitrackday2.repository.AppStatusRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor; // 🪄 Lombok magic
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

    /**
     * 🗑️ Delete Endpoint
     * Removes the shipment from the system.
     */
    @DeleteMapping("/shipments/{id}")
    public String delete(@PathVariable Long id) {
        shipmentService.delete(id);
        return "Shipment with ID " + id + " has been successfully deleted. 🗑️";
    }
    @PutMapping("/shipments/track/{trackingNo}")
    public ShipmentInterface updateByTracking(
            @PathVariable String trackingNo,
            @Valid @RequestBody Shipment shipment) {

        // Pass the tracking number to the service to locate the record
        return shipmentService.updateByTracking(trackingNo, shipment);
    }


}