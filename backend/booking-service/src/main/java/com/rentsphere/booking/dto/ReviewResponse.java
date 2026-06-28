package com.rentsphere.booking.dto;

import java.time.Instant;
import java.util.UUID;

public class ReviewResponse {
    private UUID id; private UUID listingId; private UUID renterId; private UUID bookingId;
    private Integer rating; private String comment; private Instant createdAt;

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getListingId() { return listingId; } public void setListingId(UUID listingId) { this.listingId = listingId; }
    public UUID getRenterId() { return renterId; } public void setRenterId(UUID renterId) { this.renterId = renterId; }
    public UUID getBookingId() { return bookingId; } public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }
    public Integer getRating() { return rating; } public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; } public void setComment(String comment) { this.comment = comment; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
