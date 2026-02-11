//package com.logitrack.logitrackday2.service;
//
//import com.logitrack.logitrackday2.entity.Shipment;
//import org.hibernate.engine.spi.SharedSessionContractImplementor;
//import org.hibernate.id.IdentifierGenerator;
//
//import java.io.Serializable;
//
//public class SmartIdGenerator implements IdentifierGenerator {
//    @Override
//    public Serializable generate(SharedSessionContractImplementor session, Object obj) {
//        // 1. Cast the object to a Shipment
//        Shipment shipment = (Shipment) obj;
//
//        // 2. Check if an ID already exists
//        if (shipment.getId() != null) {
//            return shipment.getId();
//        }
//
//        // 3. Otherwise, use the default sequence generation logic
//        return super.generate(session, obj);
//    }
//}