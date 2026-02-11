package com.logitrack.logitrackday2.controller;

import com.logitrack.logitrackday2.entity.Driver;
import com.logitrack.logitrackday2.repository.DriverRepository;
import com.logitrack.logitrackday2.repository.ShipmentDriverView;
import com.logitrack.logitrackday2.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DriverController {

    private final DriverRepository driverRepository;

    @PostMapping
    public Driver create(@RequestBody Driver driver) {
        return driverRepository.save(driver);
    }

    @GetMapping
    public List<Driver> getAll() {
        return driverRepository.findAll();
    }

}