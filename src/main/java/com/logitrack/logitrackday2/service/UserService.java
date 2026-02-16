package com.logitrack.logitrackday2.service;

import com.logitrack.logitrackday2.entity.Driver;
import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.repository.DriverRepository;
import com.logitrack.logitrackday2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository; // Added for synchronization
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user and automatically handles entity synchronization.
     * Uses @Transactional to ensure database consistency.
     */
    @Transactional
    public User createNewUser(User newUser) {
        if(userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken!");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // Lombok generates isActive() for boolean fields
        // We also use the object Boolean type to allow for null checks
        if (!newUser.isActive()) {
            newUser.setActive(true); // Default to active if not specified
        }

        User savedUser = userRepository.save(newUser);

        if (savedUser.getRole() == User.Role.DRIVER) {
            Driver driverEntity = new Driver();
            driverEntity.setName(savedUser.getFullName() != null ? savedUser.getFullName() : savedUser.getUsername());
            driverEntity.setUser(savedUser);
            driverEntity.setLicenseNumber("PENDING");
            driverRepository.save(driverEntity);
        }

        return savedUser;
    }

    /**
     * Admin capability to reset any user's password.
     */
    public void resetPassword(Long id, String newRawPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);
    }

    /**
     * Returns all registered users for the Admin management view.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}