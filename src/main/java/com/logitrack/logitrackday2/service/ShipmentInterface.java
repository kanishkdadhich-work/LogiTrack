package com.logitrack.logitrackday2.service;

/**
 * The Contract: Defines the essential behaviors for any shipment type.
 * This allows the Service layer to remain "Type-Blind" for better scalability.
 */
public interface ShipmentInterface {
    Long getId();
    Double getLength();
    void setLength(Double length);

    Double getWidth();
    void setWidth(Double width);

    Double getHeight();
    void setHeight(Double height);

    Double getDistanceInMeters();
    void setDistanceInMeters(Double distance);

    Double getCostPerMeter();
    void setCostPerMeter(Double cost);
    
    Double getTotalCost();
    void setTotalCost(Double totalCost);
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