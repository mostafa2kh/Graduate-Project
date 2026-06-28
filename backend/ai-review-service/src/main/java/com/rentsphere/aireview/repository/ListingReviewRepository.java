package com.rentsphere.aireview.repository;

import com.rentsphere.aireview.entity.ListingReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ListingReviewRepository extends JpaRepository<ListingReview, UUID> {
    Optional<ListingReview> findByListingId(UUID listingId);
    boolean existsByListingId(UUID listingId);
}
