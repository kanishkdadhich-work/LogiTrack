package com.logitrack.logitrackday2.config;

import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {

            // 1. Create Default ADMIN
            // Check both username AND email to prevent Unique Constraint errors
            if (userRepo.findByUsername("admin").isEmpty() && userRepo.findByEmail("admin@logitrack.com").isEmpty()) {
                User admin = new User(
                        "admin",
                        encoder.encode("admin123"),
                        User.Role.ADMIN,
                        "admin@logitrack.com",
                        "System Admin",
                        "555-0199"
                );
                userRepo.save(admin);
                System.out.println("✅ ADMIN USER CREATED: admin / admin123");
            } else {
                System.out.println("ℹ️ Admin user already exists, skipping...");
            }

            // 2. Create Default MANAGER
            if (userRepo.findByUsername("manager").isEmpty() && userRepo.findByEmail("manager@logitrack.com").isEmpty()) {
                User manager = new User(
                        "manager",
                        encoder.encode("manager123"),
                        User.Role.MANAGER,
                        "manager@logitrack.com",
                        "Manager User",
                        "555-0155"
                );
                userRepo.save(manager);
                System.out.println("✅ MANAGER USER CREATED: manager / manager123");
            }

            // 3. Create Default DRIVER (Carrier)
            if (userRepo.findByUsername("driver").isEmpty() && userRepo.findByEmail("driver@logitrack.com").isEmpty()) {
                User driver = new User(
                        "driver",
                        encoder.encode("driver123"),
                        User.Role.DRIVER,
                        "driver@logitrack.com",
                        "John Driver",
                        "555-0100"
                );
                userRepo.save(driver);
                System.out.println("✅ DRIVER USER CREATED: driver / driver123");
            }
        };
    }
}