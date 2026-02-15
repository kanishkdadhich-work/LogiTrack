package com.logitrack.logitrack.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class TrackingHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    private PackageStatus status;

    private LocalDateTime timestamp;
    private String updatedBy; // Username of the person who made the change

    public TrackingHistory(String trackingNumber, PackageStatus status, String updatedBy) {
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.updatedBy = updatedBy;
        this.timestamp = LocalDateTime.now();
    }
}