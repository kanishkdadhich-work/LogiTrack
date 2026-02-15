package com.logitrack.logitrack.backend.controller;

import com.logitrack.logitrack.backend.dto.LoginRequest;
import com.logitrack.logitrack.backend.dto.JwtResponse;
import com.logitrack.logitrack.backend.security.JwtUtils;
import com.logitrack.logitrack.backend.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shipment")
public class ShipmentUse{
    private final PackageService packageService;

    public ShipmentUse(PackageService packageService) {
        this.packageService = packageService;
    }

    @PutMapping("/status/{trackingNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<String> updateStatus(
            @PathVariable String trackingNumber,
            @RequestBody String newStatus
    ) {
        // We will call a service method that finds the package by trackingNumber
        // and updates it if the security check passes.
        return ResponseEntity.ok("Status updated for " + trackingNumber);
    }
    @DeleteMapping("/delete/{trackingNumber}")
    @PreAuthorize("hasRole('MANAGER')") // 🛑 Strictly for Managers
    public ResponseEntity<String> removePackage(@PathVariable String trackingNumber) {
        // Logic to find by trackingNumber and delete
        return ResponseEntity.ok("Package " + trackingNumber + " has been removed.");
    }
    @PatchMapping("/{trackingNumber}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<com.logitrack.logitrack.backend.entity.Package> assignDriver(
            @PathVariable String trackingNumber,
            @RequestParam Long driverId) {

        com.logitrack.logitrack.backend.entity.Package updatedPackage = packageService.assignDriverToPackage(trackingNumber, driverId);
        return ResponseEntity.ok(updatedPackage);
    }
}
