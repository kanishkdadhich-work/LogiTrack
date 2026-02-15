package com.logitrack.logitrack.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // We will hash this later for security!

    private String fullName;

    @Enumerated(EnumType.STRING)
    private UserRole role;
}