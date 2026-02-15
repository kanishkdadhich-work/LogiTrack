package com.logitrack.logitrack.backend.service;

import com.logitrack.logitrack.backend.dto.PackageResponseDTO;
import com.logitrack.logitrack.backend.entity.Package;
import com.logitrack.logitrack.backend.entity.PackageStatus;
import com.logitrack.logitrack.backend.entity.TrackingHistory;
import com.logitrack.logitrack.backend.entity.User;
import com.logitrack.logitrack.backend.entity.UserRole;
import com.logitrack.logitrack.backend.repository.PackageRepository;
import com.logitrack.logitrack.backend.repository.TrackingHistoryRepository;
import com.logitrack.logitrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PackageServiceImpl implements PackageService {

    @Autowired
    private PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final TrackingHistoryRepository historyRepository;



    @Override
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }



    public PackageServiceImpl(
            PackageRepository packageRepository,
            UserRepository userRepository,
            TrackingHistoryRepository historyRepository) {
        this.packageRepository = packageRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository; // 3. Assign it
    }
    @Transactional
    public Package assignDriverToPackage(String trackingNumber, Long driverId) {
        // 1. Find the package
        Package pkg = packageRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Package not found: " + trackingNumber));

        // 2. Find the driver
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + driverId));

        // 3. Security Check: Is this person actually a Driver?
        if (!driver.getRole().equals(UserRole.ROLE_DRIVER)) {
            throw new RuntimeException("User is not a registered Driver!");
        }

        // 4. Perform assignment
        pkg.setDriver(driver);

        // Save and return
        return packageRepository.save(pkg);
    }
    @Override
    public Package createPackage(Package pkg) {
        // 1. Business Logic: Calculate Price
        // Example: $2.0 per km + $1.5 per kg
        if (pkg.getTrackingNumber() == null || pkg.getTrackingNumber().isEmpty()) {
            throw new RuntimeException("Tracking number is required!");
        }

        // Check if tracking number already exists to avoid duplicates
        if (packageRepository.findByTrackingNumber(pkg.getTrackingNumber()).isPresent()) {
            throw new RuntimeException("Tracking number already exists!");
        }

        double distance = (pkg.getDistance() != null) ? pkg.getDistance() : 0.0;
        double weight = (pkg.getWeight() != null) ? pkg.getWeight() : 0.0;

        double calculatedTotal = (distance * 2.0) + (weight * 1.5);
        pkg.setPrice(java.math.BigDecimal.valueOf(calculatedTotal));

        // 2. Set Initial Status
        if (pkg.getStatus() == null) {
            pkg.setStatus(PackageStatus.ORDERED);
        }

        // 3. Save to DB
        return packageRepository.save(pkg);
    }

    @Override
    public List<Package> getMyAssignedPackages(String username) {
        return packageRepository.findByDriverUsername(username);
    }

    @Override
    @Transactional
    public PackageResponseDTO updatePackageStatus(String trackingNumber, PackageStatus status, String currentUsername) {
        // 1. Fetch the ENTITY from the repository (not the DTO)
        Package pkg = packageRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Package not found: " + trackingNumber));

        // 2. Security Check (Working with the Entity's data)
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole().equals(UserRole.ROLE_DRIVER)) {
            if (pkg.getDriver() == null || !pkg.getDriver().getUsername().equals(currentUsername)) {
                throw new RuntimeException("You are not authorized to update this package!");
            }
        }

        // 3. Update the Entity
        pkg.setStatus(status);

        // 4. Save the History
        TrackingHistory history = new TrackingHistory(trackingNumber, status, currentUsername);
        historyRepository.save(history);

        // 5. Save the updated Entity
        Package savedPackage = packageRepository.save(pkg);

        // 6. FINALLY: Convert the saved Entity to a DTO for the return
        return convertToDTO(savedPackage);
    }
    @Override
    public List<TrackingHistory> getTrackingHistory(String trackingNumber) {
        // We use the repository method we created earlier
        return historyRepository.findByTrackingNumberOrderByTimestampDesc(trackingNumber);
    }

    private PackageResponseDTO convertToDTO(Package pkg) {
        PackageResponseDTO dto = new PackageResponseDTO();
        dto.setTrackingNumber(pkg.getTrackingNumber());
        dto.setSenderName(pkg.getSenderName());
        dto.setReceiverName(pkg.getReceiverName());
        dto.setDestinationAddress(pkg.getDestinationAddress());
        dto.setStatus(pkg.getStatus());
        dto.setPrice(pkg.getPrice());
        if (pkg.getDriver() != null) {
            dto.setDriverUsername(pkg.getDriver().getUsername());
        }
        return dto;
    }

}