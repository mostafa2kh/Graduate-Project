package com.rentsphere.booking.repository;

import com.rentsphere.booking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByListingIdOrderByCreatedAtDesc(UUID listingId);
    Optional<Review> findByBookingId(UUID bookingId);
    boolean existsByBookingId(UUID bookingId);
}
