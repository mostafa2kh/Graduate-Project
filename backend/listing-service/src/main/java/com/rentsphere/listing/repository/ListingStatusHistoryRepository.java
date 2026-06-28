package com.rentsphere.listing.repository;

import com.rentsphere.listing.entity.ListingStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ListingStatusHistoryRepository extends JpaRepository<ListingStatusHistory, UUID> {
    List<ListingStatusHistory> findByListingIdOrderByCreatedAtDesc(UUID listingId);
}
