package com.logitrack.logitrack.backend.service;

import com.logitrack.logitrack.backend.dto.PackageResponseDTO;
import com.logitrack.logitrack.backend.entity.Package;
import com.logitrack.logitrack.backend.entity.PackageStatus;
import com.logitrack.logitrack.backend.entity.TrackingHistory;

import java.util.List;

public interface PackageService {
    List<Package> getAllPackages();
    Package createPackage(Package pkg);
    List<Package> getMyAssignedPackages(String username);
    Package assignDriverToPackage(String trackingNumber, Long driverId);
    PackageResponseDTO updatePackageStatus(String trackingNumber, PackageStatus status, String currentUsername);
    List<TrackingHistory> getTrackingHistory(String trackingNumber);
    // We can add more later, like getByTrackingNumber
}