package com.logitrack.logitrackday2.controller;

import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.repository.UserRepository;
import com.logitrack.logitrackday2.security.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Matches your React port
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is active
        if (!user.isActive()) {
            System.out.println("❌ Login failed for user: " + username + " - Account is inactive");
            return ResponseEntity.status(403).body("Your account has been deactivated. Please contact an administrator.");
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            // Generate token with the role as a String
            String roleString = user.getRole().name();
            String token = jwtUtil.generateToken(user.getUsername(), roleString);

            System.out.println("✅ Login successful for user: " + username + " with role: " + roleString);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", roleString,
                    "username", user.getUsername()
            ));
        }

        System.out.println("❌ Login failed for user: " + username + " - Invalid password");
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole().name(),
                "email", user.getEmail(),
                "fullName", user.getFullName()
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify() {
        return ResponseEntity.ok(Map.of("status", "API is working"));
    }

}

//@Data
//class LoginRequest {
//    private String username;
//    private String password;
//}