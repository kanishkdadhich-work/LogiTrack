package com.logitrack.logitrack.backend.repository;

import com.logitrack.logitrack.backend.entity.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    // That's it! Spring writes the code for us at runtime.
    Optional<Package> findByTrackingNumber(String trackingNumber);
    List<Package> findByDriverUsername(String username);
}