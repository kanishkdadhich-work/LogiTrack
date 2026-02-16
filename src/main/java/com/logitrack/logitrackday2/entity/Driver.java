package com.logitrack.logitrackday2.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private List<Shipment> shipments;

    /**
     * Links the Driver Entity to the Driver User account.
     */
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Implementation of Hierarchy:
     * Every driver is overseen by a Manager User.
     */
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;
}