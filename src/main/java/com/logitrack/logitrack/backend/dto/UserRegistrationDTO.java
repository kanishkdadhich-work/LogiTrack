package com.logitrack.logitrack.backend.dto;

import lombok.Data;

@Data
public class UserRegistrationDTO {
    private String username;
    private String password;
    private String fullName;
    private String role; // e.g., "ROLE_DRIVER"
}