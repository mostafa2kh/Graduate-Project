package com.rentsphere.user.repository;

import com.rentsphere.user.entity.FavoriteListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteListingRepository extends JpaRepository<FavoriteListing, UUID> {
    List<FavoriteListing> findByUserId(UUID userId);
    Optional<FavoriteListing> findByUserIdAndListingId(UUID userId, UUID listingId);
    boolean existsByUserIdAndListingId(UUID userId, UUID listingId);
    void deleteByUserIdAndListingId(UUID userId, UUID listingId);
}
