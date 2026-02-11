package com.logitrack.logitrackday2.config;

import com.logitrack.logitrackday2.service.ShipmentInterface;
import com.logitrack.logitrackday2.service.ShipmentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PutMapping;

//
//@Component
//public class DatabaseSync implements CommandLineRunner {
//
//    private final ShipmentService shipmentService;
//
//    // Standard constructor injection - no @Autowired needed!
//    public DatabaseSync(ShipmentService shipmentService) {
//        this.shipmentService = shipmentService;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        System.out.println("🏁 App started! Synchronizing DB sequence...");
//            shipmentService.syncIdSequence();
//    }
//}
