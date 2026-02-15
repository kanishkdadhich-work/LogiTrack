package com.logitrack.logitrack.backend.dto;

import com.logitrack.logitrack.backend.entity.UserRole;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String fullName;
    private UserRole role;
}