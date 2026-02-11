package com.logitrack.logitrackday2.service;

/**
 * The Contract: Defines the essential behaviors for any shipment type.
 * This allows the Service layer to remain "Type-Blind" for better scalability.
 */
public interface ShipmentInterface {
    Long getId();

    String getTrackingNumber();
    void setTrackingNumber(String trackingNumber);

    String getDeliveryAddress();
    void setDeliveryAddress(String deliveryAddress);

    String getStatus();
    void setStatus(String status);
    default boolean hasManualId() {
        return getId() != null;
    }
    void updateFrom(ShipmentInterface other);
    void delete(Long id);
}