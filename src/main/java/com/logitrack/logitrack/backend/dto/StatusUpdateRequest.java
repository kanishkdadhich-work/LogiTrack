package com.logitrack.logitrack.backend.dto;

import com.logitrack.logitrack.backend.entity.PackageStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private PackageStatus status;
    // You can add fields like 'String remarks' later!
}