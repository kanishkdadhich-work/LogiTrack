package com.logitrack.logitrack.backend.repository;

import com.logitrack.logitrack.backend.entity.TrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingHistoryRepository extends JpaRepository<TrackingHistory, Long> {
    List<TrackingHistory> findByTrackingNumberOrderByTimestampDesc(String trackingNumber);

}
