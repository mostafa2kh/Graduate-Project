package com.rentsphere.listing.repository;

import com.rentsphere.listing.entity.Listing;
import com.rentsphere.listing.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {
    Page<Listing> findByLandlordId(UUID landlordId, Pageable pageable);
    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);
    long countByLandlordId(UUID landlordId);
}
