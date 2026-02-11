package com.logitrack.logitrackday2.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.logitrack.logitrackday2.service.ShipmentInterface;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "shipments")
public class Shipment implements ShipmentInterface {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String trackingNumber;
    private String deliveryAddress;
    private String status;

    public Shipment() {}
    @Transient
    public String getDriverName() {
        return (driver != null) ? driver.getName() : "Unassigned";
    }
    // Interface Method Overrides
    @Override public Long getId() { return id; }
//    @Override public void setId(Long id) { this.id = id; }

    @Override public String getTrackingNumber() { return trackingNumber; }
    @Override public void setTrackingNumber(String trk) { this.trackingNumber = trk; }

    @Override public String getDeliveryAddress() { return deliveryAddress; }
    @Override public void setDeliveryAddress(String addr) { this.deliveryAddress = addr; }

    @Override public String getStatus() { return status; }
    @Override public void setStatus(String status) { this.status = status; }

    @Override
    public void updateFrom(ShipmentInterface other) {
        this.setTrackingNumber(other.getTrackingNumber());
        this.setDeliveryAddress(other.getDeliveryAddress());
        this.setStatus(other.getStatus());
    }

    @Override
    public void delete(Long id) {

    }
    @Setter
    @Getter
    @ManyToOne

    @JoinColumn(name = "driver_id")
    @JsonBackReference // 👈 Add this! Prevents the loop from going back to Driver
    private Driver driver;

}