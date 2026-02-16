package com.logitrack.logitrackday2.service;

import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createNewUser(User newUser) {
        // Optimization: Check if user already exists
        if(userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken!");
        }

        // Encrypting the password before saving [Goal #1]
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return userRepository.save(newUser);
    }

    public void resetPassword(Long id, String newRawPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Admin overrides with new encrypted password [Goal #1]
        user.setPassword(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);
    }
}