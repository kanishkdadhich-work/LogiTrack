package com.logitrack.logitrackday2;

import com.logitrack.logitrackday2.entity.AppStatus;
import com.logitrack.logitrackday2.entity.Shipment;
import com.logitrack.logitrackday2.repository.AppStatusRepository;
import com.logitrack.logitrackday2.repository.ShipmentRepository;
import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry; // Add this if you want to use the loop
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class LogiTrackDay2Application {
//    Dotenv dotenv = Dotenv.configure()
//            .directory("./") // Explicitly look in the root
//            .ignoreIfMissing()
//            .load();
//
//    // 2. Manually set the 3 key variables Spring needs
//    // This bypasses the need for the .entries() loop entirely
//    if (dotenv.get("DB_URL") != null) {
//        System.setProperty("DB_URL", dotenv.get("DB_URL"));
//        System.setProperty("DB_USER", dotenv.get("DB_USER"));
//        System.setProperty("DB_PASS", dotenv.get("DB_PASS"));
//    }

    public static void main(String[] args) {
        SpringApplication.run(LogiTrackDay2Application.class, args);
    }
    @Bean
    CommandLineRunner initHealth(AppStatusRepository repo) {
        return args -> {
            // We create the status object with an ID and a message
            AppStatus status = new AppStatus(1L, "LogiTrack System Up");
            repo.save(status);
        };
    }
//    @Bean
//    CommandLineRunner autoAddShipment(ShipmentRepository repository) {
//        return args -> {
//            // This creates a new record in the 'shipments' table every time you start the app
//            Shipment entry = new Shipment();
//            entry.setTrackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
//            entry.setDeliveryAddress("789 Logistics Way, Warehouse District");
//            entry.setStatus("IN_TRANSIT");
//
//            repository.save(entry);
//            System.out.println(">>> JPA: New Shipment table entry created automatically!");
//        };
//    }
}