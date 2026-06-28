package com.rentsphere.booking.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "listing_id", nullable = false) private UUID listingId;
    @Column(name = "renter_id", nullable = false) private UUID renterId;
    @Column(name = "booking_id", nullable = false, unique = true) private UUID bookingId;
    @Column(nullable = false) private Integer rating;
    @Column(length = 2048) private String comment;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    public Review() {}
    @PrePersist protected void onCreate() { createdAt = Instant.now(); updatedAt = Instant.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = Instant.now(); }

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getListingId() { return listingId; } public void setListingId(UUID listingId) { this.listingId = listingId; }
    public UUID getRenterId() { return renterId; } public void setRenterId(UUID renterId) { this.renterId = renterId; }
    public UUID getBookingId() { return bookingId; } public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }
    public Integer getRating() { return rating; } public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; } public void setComment(String comment) { this.comment = comment; }
    public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; }
}
