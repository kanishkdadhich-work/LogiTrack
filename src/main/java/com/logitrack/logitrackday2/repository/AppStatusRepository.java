package com.logitrack.logitrackday2.repository;

import com.logitrack.logitrackday2.entity.AppStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppStatusRepository extends JpaRepository<AppStatus, Long> {
    // This empty interface gives us: findAll(), save(), findById(), etc.
}