package com.logitrack.logitrackday2.repository;

import com.logitrack.logitrackday2.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    // Standard methods like findById are included automatically! 🪄

}