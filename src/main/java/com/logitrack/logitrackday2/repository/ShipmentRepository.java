package com.logitrack.logitrackday2.repository;

import com.logitrack.logitrackday2.entity.Shipment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    // Derived query method: JPA creates the SQL automatically!
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    //projection baby
    List<ShipmentDriverView> findAllProjectedBy();
    List<Shipment> findByDriver_User_Username(String username);
//    @Query(value = "SELECT nextval('shipments_seq')", nativeQuery = true)
//    Long getNextSequenceValue();
////    @Modifying
//    @Transactional
//    @Query(value = "SELECT setval('shipment_id_seq', :nextId, true)", nativeQuery = true)
//    void resetSequence(@Param("nextId") Long nextId);

}