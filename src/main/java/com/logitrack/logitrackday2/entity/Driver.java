package com.logitrack.logitrackday2.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String licenseNumber;

    @OneToMany(mappedBy = "driver")
    @JsonManagedReference // 👈 Add this! The parent "manages" the relationship
    private List<Shipment> shipments;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}