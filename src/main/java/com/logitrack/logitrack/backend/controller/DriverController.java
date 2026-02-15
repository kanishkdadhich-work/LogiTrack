package com.logitrack.logitrack.backend.controller;

import com.logitrack.logitrack.backend.dto.PackageResponseDTO;
import com.logitrack.logitrack.backend.dto.StatusUpdateRequest;
import com.logitrack.logitrack.backend.entity.Package;
import com.logitrack.logitrack.backend.service.PackageService;
import com.logitrack.logitrack.backend.service.PackageServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final PackageService packageService;

    public DriverController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping("/my-packages")
    @PreAuthorize("hasRole('DRIVER')")
    public List<Package> getAssignedPackages(Authentication auth) {
        return packageService.getMyAssignedPackages(auth.getName());

    }

    @PatchMapping("/{trackingNumber}/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<PackageResponseDTO> updateStatus(
            @PathVariable String trackingNumber,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {

        PackageResponseDTO updated = packageService.updatePackageStatus(
                trackingNumber,
                request.getStatus(),
                authentication.getName()
        );
        return ResponseEntity.ok(updated);
    }
    @PostMapping("/add")
    @PreAuthorize("hasRole('MANAGER')") // Admin is included via hierarchy
    public ResponseEntity<Package> addPackage(@RequestBody Package newPackage) {
        Package savedPackage = packageService.createPackage(newPackage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPackage);
    }
}