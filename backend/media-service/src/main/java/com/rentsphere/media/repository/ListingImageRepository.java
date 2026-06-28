package com.rentsphere.media.repository;

import com.rentsphere.media.entity.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ListingImageRepository extends JpaRepository<ListingImage, UUID> {
    List<ListingImage> findByListingIdOrderBySortOrderAsc(UUID listingId);
    long countByListingId(UUID listingId);
    Optional<ListingImage> findByIdAndListingId(UUID id, UUID listingId);
    Optional<ListingImage> findByListingIdAndIsPrimaryTrue(UUID listingId);

    @Modifying
    @Query("UPDATE ListingImage li SET li.isPrimary = false WHERE li.listingId = :listingId")
    void clearPrimaryByListingId(UUID listingId);
}
