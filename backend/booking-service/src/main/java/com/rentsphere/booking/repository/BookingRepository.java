package com.rentsphere.booking.repository;

import com.rentsphere.booking.entity.Booking;
import com.rentsphere.booking.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByRenterIdOrderByCreatedAtDesc(UUID renterId, Pageable pageable);

    Page<Booking> findByLandlordIdOrderByCreatedAtDesc(UUID landlordId, Pageable pageable);

    Optional<Booking> findByIdAndRenterId(UUID id, UUID renterId);

    Optional<Booking> findByIdAndLandlordId(UUID id, UUID landlordId);

    List<Booking> findByListingIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            UUID listingId, BookingStatus status, LocalDate endDate, LocalDate startDate);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.listingId = :listingId AND b.status = 'ACCEPTED' " +
           "AND b.startDate < :endDate AND b.endDate > :startDate")
    boolean existsOverlappingAccepted(
            @Param("listingId") UUID listingId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.listingId = :listingId AND b.status IN ('PENDING', 'ACCEPTED') " +
           "AND b.startDate < :endDate AND b.endDate > :startDate")
    boolean existsOverlappingActive(
            @Param("listingId") UUID listingId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
