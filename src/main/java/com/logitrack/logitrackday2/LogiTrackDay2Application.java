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

    public static void main(String[] args) {
        SpringApplication.run(LogiTrackDay2Application.class, args);
    }

    // Bean removed to stop the AppStatus database crash
}


