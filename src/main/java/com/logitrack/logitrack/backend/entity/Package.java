package com.logitrack.logitrack.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal; // Import for money

@Entity
@Data
@Table(name = "packages")

public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingNumber;

    // Addresses
    private String senderName;
    private String ReceiverName;
    private String sourceAddress;
    private String destinationAddress; // formerly deliveryAddress

    // Dimensions & Weight
    private Double weight; // in kg
    private Double length; // in cm
    private Double width;  // in cm
    private Double height; // in cm

    // Calculations
    private Double distance; // in km
    private BigDecimal price; // Final calculated price

    @Enumerated(EnumType.STRING) // Stores the name "ORDERED" in the DB, not the number 0
    private PackageStatus status;
//    private String driverId;

    @ManyToOne(fetch = FetchType.LAZY) // Loads driver info only when needed
    @JoinColumn(name = "driver_id")    // Creates a foreign key column in the DB
    private User driver;
}