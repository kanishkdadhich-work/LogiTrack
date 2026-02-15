package com.logitrack.logitrack.backend.controller;

import com.logitrack.logitrack.backend.entity.TrackingHistory;
import com.logitrack.logitrack.backend.service.PackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/track")
public class PublicPackageController {

    private final PackageService packageService;

    public PublicPackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping("/{trackingNumber}")
    public ResponseEntity<List<TrackingHistory>> trackPackage(@PathVariable String trackingNumber) {
        List<TrackingHistory> history = packageService.getTrackingHistory(trackingNumber);
        return ResponseEntity.ok(history);
    }
}