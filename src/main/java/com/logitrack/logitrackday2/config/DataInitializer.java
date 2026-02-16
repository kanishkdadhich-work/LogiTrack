package com.logitrack.logitrackday2.config;

import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.entity.Driver;
import com.logitrack.logitrackday2.repository.UserRepository;
import com.logitrack.logitrackday2.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor // Automatically injects the repositories
public class DataInitializer {

    private final UserRepository userRepo;
    private final DriverRepository driverRepo;
    private final PasswordEncoder encoder;

    @Bean
    CommandLineRunner initUsers() {
        return args -> {
            // 1. Create or update ADMIN
            var adminOpt = userRepo.findByUsername("admin");
            if (adminOpt.isEmpty()) {
                userRepo.save(new User("admin", encoder.encode("admin123"), User.Role.ADMIN, "admin@logitrack.com", "System Admin", "555-0199"));
                System.out.println("✅ ADMIN CREATED");
            } else {
                // Fix existing admin with wrong role
                User admin = adminOpt.get();
                if (admin.getRole() != User.Role.ADMIN) {
                    admin.setRole(User.Role.ADMIN);
                    userRepo.save(admin);
                    System.out.println("✅ ADMIN ROLE FIXED (was " + admin.getRole() + ", now ADMIN)");
                }
            }

            // 2. Create or update MANAGER
            var managerOpt = userRepo.findByUsername("manager");
            if (managerOpt.isEmpty()) {
                userRepo.save(new User("manager", encoder.encode("manager123"), User.Role.MANAGER, "manager@logitrack.com", "Logistics Manager", "555-0155"));
                System.out.println("✅ MANAGER CREATED");
            } else {
                User manager = managerOpt.get();
                if (manager.getRole() != User.Role.MANAGER) {
                    manager.setRole(User.Role.MANAGER);
                    userRepo.save(manager);
                    System.out.println("✅ MANAGER ROLE FIXED");
                }
            }

            // 3. Create or update DRIVER User AND link to Driver Table
            var driverOpt = userRepo.findByUsername("driver");
            if (driverOpt.isEmpty()) {
                User driverUser = new User("driver", encoder.encode("driver123"), User.Role.DRIVER, "driver@logitrack.com", "John Doe", "555-0100");
                userRepo.save(driverUser);

                // IMPORTANT: Create the Driver entity so it appears in dropdowns
                Driver driverEntity = new Driver();
                driverEntity.setName("John Doe");
                driverEntity.setLicenseNumber("LC-998877");
                driverEntity.setUser(driverUser);
                driverRepo.save(driverEntity);

                System.out.println("✅ DRIVER USER & ENTITY CREATED");
            } else {
                User driver = driverOpt.get();
                if (driver.getRole() != User.Role.DRIVER) {
                    driver.setRole(User.Role.DRIVER);
                    userRepo.save(driver);
                    System.out.println("✅ DRIVER ROLE FIXED");
                }
            }
        };
    }
}