package com.logitrack.logitrack.backend.controller;

import com.logitrack.logitrack.backend.dto.UserRegistrationDTO;
import com.logitrack.logitrack.backend.entity.User;
import com.logitrack.logitrack.backend.entity.UserRole;
import com.logitrack.logitrack.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.logitrack.logitrack.backend.service.PackageService;
import com.logitrack.logitrack.backend.service.UserServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/onboard-driver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> onboardDriver(@RequestBody User driver) {
        User savedDriver = userService.registerUser(driver, UserRole.ROLE_DRIVER);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDriver);
    }
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            User createdUser = userService.createUser(registrationDTO);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
