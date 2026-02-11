package com.logitrack.logitrackday2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity                          // Tells Spring this class represents a DB table
@Table(name = "app_status")      // Tells Spring the exact table name in Postgres
@Data                            // Lombok: Automatically generates Getters and Setters
@NoArgsConstructor
@AllArgsConstructor
public class AppStatus {

    @Id                          // Marks 'id' as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status_message") // Maps this Java field to the DB column name
    private String statusMessage;
}