package com.logitrack.logitrack.backend.service;

import com.logitrack.logitrack.backend.dto.UserRegistrationDTO;
import com.logitrack.logitrack.backend.entity.User;
import com.logitrack.logitrack.backend.entity.UserRole;
import com.logitrack.logitrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user, UserRole role) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role); // Set to ROLE_DRIVER, ROLE_MANAGER, etc.
        return userRepository.save(user);
    }
    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(UserRegistrationDTO dto) {
        // 1. Check if username is taken
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        // 2. Create new user entity
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());
        user.setRole(UserRole.valueOf(dto.getRole()));

        // 3. ENCRYPT the password!
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return userRepository.save(user);
    }
}