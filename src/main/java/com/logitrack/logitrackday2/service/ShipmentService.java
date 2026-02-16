package com.logitrack.logitrackday2.service;

import com.logitrack.logitrackday2.entity.Driver;
import com.logitrack.logitrackday2.entity.Shipment;
import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.exception.*;
import com.logitrack.logitrackday2.repository.DriverRepository;
import com.logitrack.logitrackday2.repository.ShipmentDriverView;
import com.logitrack.logitrackday2.repository.ShipmentRepository;
import com.logitrack.logitrackday2.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class ShipmentService { // Fixed: Removed the random "e" before the class name

    private final ShipmentRepository shipmentRepository;

    /**
     * 🧩 Constructor Injection: The professional standard.
     * Spring finds the Repository bean and "plugs" it in here.
     */
    public ShipmentService(ShipmentRepository shipmentRepository,
                           DriverRepository driverRepository,
                           UserRepository userRepository) {
        this.shipmentRepository = shipmentRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository; // Initialization happens here
    }

    // Inside ShipmentService.java
    public boolean isSystemHealthy() {
        try {
            // We use the existing repository to see if we can reach the DB
            return shipmentRepository.count() >= 0;
        } catch (Exception e) {
            return false; // Database is down or unreachable
        }
    }

    /**
     * Retrieves all shipments as an Interface list.
     * This hides the specific "Shipment" class from the rest of the app.
     */
    public List<ShipmentInterface> getAll() {
        return shipmentRepository.findAll()
                .stream()
                .map(shipment -> (ShipmentInterface) shipment)
                .collect(Collectors.toList());
    }
    @Transactional
    public void deleteByTrackingNumber(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Shipment not found: " + trackingNumber));

        shipmentRepository.delete(shipment);
    }
    /**
     * Saves a new shipment using the Interface.
     */
    public ShipmentInterface saveFromInterface(ShipmentInterface shipment) {
        return (ShipmentInterface) shipmentRepository.save((Shipment) shipment);
    }

    public ShipmentInterface getByTracking(String trackingNo) {
        return (ShipmentInterface) shipmentRepository.findByTrackingNumber(trackingNo)
                .orElse(null);
    }

    public ShipmentInterface getById(Long id) {
        return (ShipmentInterface) shipmentRepository.findById(id)
                .orElse(null);
    }

    /**
     * 🔄 THE SCALABLE UPDATE LOGIC (PUT) - Version 1 (Interface-based)
     */
    public ShipmentInterface updateFromInterface(Long id, ShipmentInterface details) {
        return (ShipmentInterface) shipmentRepository.findById(id)
                .map(existing -> {
                    existing.setTrackingNumber(details.getTrackingNumber());
                    existing.setDeliveryAddress(details.getDeliveryAddress());
                    existing.setStatus(details.getStatus());
                    return shipmentRepository.save(existing);
                })
                .orElse(null);
    }

    /**
     * 💾 SECURE SAVE LOGIC
     * Handles duplicate tracking checks and transactions.
     */

    private final UserRepository userRepository;

    @Transactional
    public ShipmentInterface save(Shipment shipment) {
        // 1. Validate Tracking Number Syntax (TRK-XXXXX)
        validateTrackingNumber(shipment.getTrackingNumber());

        // 2. Check for unique tracking number
        if (shipmentRepository.findByTrackingNumber(shipment.getTrackingNumber()).isPresent()) {
            throw new DuplicateIdException();
        }

        // 3. Volume and Cost Calculation Logic
        if (shipment.getLength() != null && shipment.getWidth() != null && shipment.getHeight() != null &&
                shipment.getDistanceInMeters() != null && shipment.getCostPerMeter() != null) {

            double volume = shipment.getLength() * shipment.getWidth() * shipment.getHeight();
            double calculatedCost = volume * shipment.getDistanceInMeters() * shipment.getCostPerMeter();
            shipment.setTotalCost(calculatedCost);
        } else if (shipment.getDistanceInMeters() != null && shipment.getCostPerMeter() != null) {
            // Fallback calculation if dimensions are missing
            double calculatedCost = shipment.getDistanceInMeters() * shipment.getCostPerMeter();
            shipment.setTotalCost(calculatedCost);
        }

        // 4. Validate the Driver 🚛
        if (shipment.getDriver() != null && shipment.getDriver().getId() != null) {
            Long driverId = shipment.getDriver().getId();
            Driver managedDriver = driverRepository.findById(driverId)
                    .orElseThrow(() -> new DriverNotFoundException("Driver not found!", driverId.toString()));
            shipment.setDriver(managedDriver); // Attach the managed entity
        }

        // 5. NEW: Validate the Manager 👨‍💼
        if (shipment.getManager() != null && shipment.getManager().getId() != null) {
            Long managerId = shipment.getManager().getId();

            // We use userRepository because Managers are stored in the users table
            User managedManager = userRepository.findById(managerId)
                    .orElseThrow(() -> new RuntimeException("Manager not found with ID: " + managerId));

            // Optional: Verify that the user actually has the MANAGER role
            if (managedManager.getRole() != User.Role.MANAGER && managedManager.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("User with ID " + managerId + " is not authorized to manage shipments.");
            }

            shipment.setManager(managedManager);
        }

        return (ShipmentInterface) shipmentRepository.save(shipment);
    }

    /**
     * 🔄 ADVANCED UPDATE LOGIC (PUT) - Version 2 (Entity-based)
     * Using the "updateFrom" rich interface method.
     */
    @Transactional
    public ShipmentInterface update(Long id, Shipment updatedData) {
        // 1. Find the existing shipment or throw an error
        Shipment existingShipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with ID: " + id));

        // 2. Check if the NEW tracking number is already used by someone ELSE
        if (!existingShipment.getTrackingNumber().equals(updatedData.getTrackingNumber())) {
            if (shipmentRepository.findByTrackingNumber(updatedData.getTrackingNumber()).isPresent()) {
                throw new DuplicateIdException();
            }
        }

        // 3. Apply changes using our "rich" interface method
        existingShipment.updateFrom((ShipmentInterface) updatedData);

        // 4. Update dimensions if provided
        if (updatedData.getLength() != null) existingShipment.setLength(updatedData.getLength());
        if (updatedData.getWidth() != null) existingShipment.setWidth(updatedData.getWidth());
        if (updatedData.getHeight() != null) existingShipment.setHeight(updatedData.getHeight());
        if (updatedData.getDistanceInMeters() != null) existingShipment.setDistanceInMeters(updatedData.getDistanceInMeters());
        if (updatedData.getCostPerMeter() != null) existingShipment.setCostPerMeter(updatedData.getCostPerMeter());

        // 5. Recalculate total cost if dimensions are present
        if (existingShipment.getLength() != null && existingShipment.getWidth() != null && existingShipment.getHeight() != null &&
                existingShipment.getDistanceInMeters() != null && existingShipment.getCostPerMeter() != null) {
            double volume = existingShipment.getLength() * existingShipment.getWidth() * existingShipment.getHeight();
            double calculatedCost = volume * existingShipment.getDistanceInMeters() * existingShipment.getCostPerMeter();
            existingShipment.setTotalCost(calculatedCost);
        }

        // 6. Update Driver if provided 🚛
        if (updatedData.getDriver() != null && updatedData.getDriver().getId() != null) {
            Long driverId = updatedData.getDriver().getId();
            Driver managedDriver = driverRepository.findById(driverId)
                    .orElseThrow(() -> new DriverNotFoundException("Driver not found!", driverId.toString()));
            existingShipment.setDriver(managedDriver);
        } else if (updatedData.getDriver() == null) {
            // Allow unsetting the driver
            existingShipment.setDriver(null);
        }

        // 7. Update Manager if provided 👨‍💼
        if (updatedData.getManager() != null && updatedData.getManager().getId() != null) {
            Long managerId = updatedData.getManager().getId();
            User managedManager = userRepository.findById(managerId)
                    .orElseThrow(() -> new RuntimeException("Manager not found with ID: " + managerId));
            if (managedManager.getRole() != User.Role.MANAGER && managedManager.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("User with ID " + managerId + " is not authorized to manage shipments.");
            }
            existingShipment.setManager(managedManager);
        } else if (updatedData.getManager() == null) {
            existingShipment.setManager(null);
        }

        // 8. Save and return
        return (ShipmentInterface) shipmentRepository.save(existingShipment);
    }


    public void delete(Long id) {
        if (!shipmentRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Shipment not found with ID: " + id);
        }
        shipmentRepository.deleteById(id);
    }
    private final DriverRepository driverRepository; // Now the symbol will resolve! ✅
    @Transactional
    // Inside ShipmentService.java

    public ShipmentInterface saveWithManualCheck(final Shipment shipment) {
        try {
            // 'final' ensures we don't accidentally reassign 'shipment' inside the method
            final String trackingNo = shipment.getTrackingNumber();

            // Manual Check
            if (shipmentRepository.findByTrackingNumber(trackingNo).isPresent()) {
                // Explicitly 'throwing' our custom exception
                throw new DuplicateIdException();
            }

            return (ShipmentInterface) shipmentRepository.save(shipment);

        } catch (DuplicateIdException e) {
            // Log the error or re-throw it to be caught by the Global Handler
            throw e;
        } catch (Exception e) {
            // Catching unexpected database issues
            throw new RuntimeException("A system error occurred during sync: " + e.getMessage());
        }
    }
    public List<ShipmentDriverView> getAllWithDrivers() {
        return shipmentRepository.findAllProjectedBy();
    }

    public Driver getDriverManually(Long driverId) {
        try {
            Optional<Driver> driverOpt = driverRepository.findById(driverId);

            if (driverOpt.isEmpty()) {
                // Manually creating and throwing the exception
                throw new DriverNotFoundException("Could not find driver", driverId.toString());
            }

            return driverOpt.get(); // No casting needed now!

        } catch (DriverNotFoundException e) {
            // You can log it here or perform logic before re-throwing
            System.out.println("Log: Attempted to access missing driver: " + e.getResourceId());
            throw e;
        }
    }
    public String assignDriverManual(final Long shipmentId, final Long driverId) {
        // 1. Find the Shipment or throw manual exception
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment ID " + shipmentId + " not found"));

        // 2. The Business Rule Check
        if ("DELIVERED".equalsIgnoreCase(shipment.getStatus())) {
            throw new InvalidShipmentStateException("Cannot reassign driver", shipment.getStatus());
        }

        // 3. Find the Driver
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new DriverNotFoundException("Driver not found", driverId.toString()));

        // 4. Manual Assignment & Save
        shipment.setDriver(driver);
        shipmentRepository.save(shipment);

        return "Driver " + driverId + " successfully assigned to Shipment " + shipmentId;
    }
    public String assignDriverByTracking(final String trackingNumber, final Long driverId) {
        // 1. Find Shipment by Tracking Number
        validateTrackingNumber(trackingNumber);

        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Tracking Number " + trackingNumber + " not recognized."));

        // 2. Reuse your Custom Business Rule Exception
        if ("DELIVERED".equalsIgnoreCase(shipment.getStatus())) {
            throw new InvalidShipmentStateException("Workflow Error: Shipment already delivered.", shipment.getStatus());
        }

        // 3. Find the Driver by ID
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new DriverNotFoundException("Driver not found", driverId.toString()));

        // 4. Manual Link
        shipment.setDriver(driver);
        shipmentRepository.save(shipment);

        return "Driver " + driver.getId() + " assigned to " + trackingNumber;
    }
    public void validateTrackingNumber(final String trackingNumber) {
        final String regex = "^TRK-\\d{5}$";

        if (trackingNumber == null || !trackingNumber.matches(regex)) {
            throw new InvalidTrackingNumberException(
                    "No Tracking Number mentioned or Invalid Format! Tracking number must follow 'TRK-XXXXX' (e.g., TRK-12345).",
                    trackingNumber
            );
        }
    }

    public ShipmentInterface updateByTracking(String trackingNo, Shipment updatedData) {
        // .orElseThrow() is the standard way to handle missing data in Spring Data JPA
        Shipment existing = shipmentRepository.findByTrackingNumber(trackingNo)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with tracking number: " + trackingNo));

        existing.setStatus(updatedData.getStatus());
        return shipmentRepository.save(existing);
    }
    public List<Shipment> getMyAssignedShipments(String username) {
        return shipmentRepository.findByDriver_User_Username(username);
    }
}