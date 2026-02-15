package com.logitrack.logitrack.backend.config;

import com.logitrack.logitrack.backend.entity.User;
import com.logitrack.logitrack.backend.entity.UserRole;
import com.logitrack.logitrack.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Now we pass the encoder to our helper method
                createUser(userRepository, passwordEncoder, "admin", "admin123", "System Admin", UserRole.ROLE_ADMIN);
                createUser(userRepository, passwordEncoder, "manager", "manager123", "Branch Manager", UserRole.ROLE_MANAGER);
                createUser(userRepository, passwordEncoder, "driver", "driver123", "John Driver", UserRole.ROLE_DRIVER);
                System.out.println("✅ Default users created with BCrypt encoding!");
            }
        };
    }

    private void createUser(UserRepository repo, PasswordEncoder encoder, String user, String pass, String name, UserRole role) {
        User u = new User();
        u.setUsername(user);
        // ENCODE the password before saving!
        u.setPassword(encoder.encode(pass));
        u.setFullName(name);
        u.setRole(role);
        repo.save(u);
    }
}