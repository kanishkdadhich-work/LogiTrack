package com.logitrack.logitrackday2.repository;

import com.logitrack.logitrackday2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    // Added to fetch list of Managers for the Shipment dropdown
    List<User> findByRole(User.Role role);
}