package com.logitrack.logitrack.backend.dto;

import com.logitrack.logitrack.backend.entity.PackageStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PackageResponseDTO {
    private String trackingNumber;
    private String senderName;
    private String receiverName;
    private String destinationAddress;
    private PackageStatus status;
    private BigDecimal price;
    private String driverUsername; // Just the name, not the whole User object!
}