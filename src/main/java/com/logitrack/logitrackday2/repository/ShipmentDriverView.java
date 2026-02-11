package com.logitrack.logitrackday2.repository;

/**
 * A Projection Interface to fetch a "joined" view of Shipments and Drivers.
 */
public interface ShipmentDriverView {
    // Fields from the Shipment entity
    String getTrackingNumber();
    String getStatus();

    // Nested Projection: This looks for a "driver" field in the Shipment entity
    DriverSummary getDriver();

    interface DriverSummary {
        Long getId();
        // If your Driver entity has a name, you could add getName() here
    }
}