package com.rentsphere.booking.service;

import com.rentsphere.booking.dto.*;
import com.rentsphere.booking.entity.*;
import com.rentsphere.booking.enums.BookingStatus;
import com.rentsphere.booking.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepo;
    private final BookingStatusHistoryRepository historyRepo;
    private final ReviewRepository reviewRepo;

    public BookingService(BookingRepository bookingRepo, BookingStatusHistoryRepository historyRepo, ReviewRepository reviewRepo) {
        this.bookingRepo = bookingRepo;
        this.historyRepo = historyRepo;
        this.reviewRepo = reviewRepo;
    }

    public BookingResponse createBooking(BookingRequest req, UUID renterId, UUID landlordId) {
        if (renterId.equals(landlordId))
            throw new IllegalArgumentException("Landlords cannot book their own listings");

        LocalDate today = LocalDate.now();
        if (req.getStartDate().isBefore(today) || req.getEndDate().isBefore(today))
            throw new IllegalArgumentException("Booking dates must be in the future");
        if (!req.getEndDate().isAfter(req.getStartDate()))
            throw new IllegalArgumentException("End date must be after start date");

        if (bookingRepo.existsOverlappingActive(req.getListingId(), req.getStartDate(), req.getEndDate()))
            throw new IllegalArgumentException("The listing is not available for the selected dates");

        Booking booking = new Booking();
        booking.setListingId(req.getListingId());
        booking.setRenterId(renterId);
        booking.setLandlordId(landlordId);
        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());
        booking.setTotalAmount(req.getTotalAmount());
        booking.setCurrency(req.getCurrency());
        booking.setGuestsCount(req.getGuestsCount());
        booking.setSpecialRequests(req.getSpecialRequests());
        booking.setStatus(BookingStatus.PENDING);
        booking = bookingRepo.save(booking);

        addHistory(booking.getId(), null, BookingStatus.PENDING.name(), renterId, "Booking requested");
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getMyBookings(UUID renterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepo.findByRenterIdOrderByCreatedAtDesc(renterId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getLandlordBookings(UUID landlordId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepo.findByLandlordIdOrderByCreatedAtDesc(landlordId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingDetail(UUID bookingId, UUID userId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getRenterId().equals(userId) && !booking.getLandlordId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return toResponse(booking);
    }

    public BookingResponse acceptBooking(UUID bookingId, UUID landlordId) {
        Booking booking = bookingRepo.findByIdAndLandlordId(bookingId, landlordId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or not your listing"));
        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalArgumentException("Only pending bookings can be accepted");

        if (bookingRepo.existsOverlappingAccepted(booking.getListingId(), booking.getStartDate(), booking.getEndDate()))
            throw new IllegalArgumentException("Cannot accept - overlapping accepted booking exists");

        booking.setStatus(BookingStatus.ACCEPTED);
        booking = bookingRepo.save(booking);
        addHistory(booking.getId(), BookingStatus.PENDING.name(), BookingStatus.ACCEPTED.name(), landlordId, "Accepted");
        return toResponse(booking);
    }

    public BookingResponse rejectBooking(UUID bookingId, UUID landlordId, RejectRequest req) {
        Booking booking = bookingRepo.findByIdAndLandlordId(bookingId, landlordId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or not your listing"));
        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalArgumentException("Only pending bookings can be rejected");

        booking.setStatus(BookingStatus.REJECTED);
        booking = bookingRepo.save(booking);
        addHistory(booking.getId(), BookingStatus.PENDING.name(), BookingStatus.REJECTED.name(), landlordId, req.getReason());
        return toResponse(booking);
    }

    public BookingResponse cancelBooking(UUID bookingId, UUID renterId) {
        Booking booking = bookingRepo.findByIdAndRenterId(bookingId, renterId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or not your booking"));
        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED)
            throw new IllegalArgumentException("Booking is already cancelled or rejected");

        String fromStatus = booking.getStatus().name();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledBy(renterId);
        booking = bookingRepo.save(booking);
        addHistory(booking.getId(), fromStatus, BookingStatus.CANCELLED.name(), renterId, "Cancelled by renter");
        return toResponse(booking);
    }

    public ReviewResponse createReview(UUID bookingId, UUID userId, ReviewRequest req) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getRenterId().equals(userId))
            throw new IllegalArgumentException("Only the renter can review this booking");
        if (booking.getStatus() != BookingStatus.COMPLETED)
            throw new IllegalArgumentException("Can only review completed bookings");
        if (reviewRepo.existsByBookingId(bookingId))
            throw new IllegalArgumentException("You have already reviewed this booking");

        Review review = new Review();
        review.setListingId(booking.getListingId());
        review.setRenterId(userId);
        review.setBookingId(bookingId);
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review = reviewRepo.save(review);
        return toReviewResponse(review);
    }

    public List<ReviewResponse> getListingReviews(UUID listingId) {
        return reviewRepo.findByListingIdOrderByCreatedAtDesc(listingId).stream().map(this::toReviewResponse).toList();
    }

    public ReviewResponse getBookingReview(UUID bookingId, UUID userId) {
        Review review = reviewRepo.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("No review found for this booking"));
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getRenterId().equals(userId) && !booking.getLandlordId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return toReviewResponse(review);
    }

    private ReviewResponse toReviewResponse(Review r) {
        ReviewResponse resp = new ReviewResponse();
        resp.setId(r.getId()); resp.setListingId(r.getListingId()); resp.setRenterId(r.getRenterId());
        resp.setBookingId(r.getBookingId()); resp.setRating(r.getRating()); resp.setComment(r.getComment());
        resp.setCreatedAt(r.getCreatedAt());
        return resp;
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse checkAvailability(UUID listingId, LocalDate startDate, LocalDate endDate) {
        boolean hasOverlap = bookingRepo.existsOverlappingActive(listingId, startDate, endDate);
        return new AvailabilityResponse(!hasOverlap, List.of());
    }

    private void addHistory(UUID bookingId, String from, String to, UUID changedBy, String note) {
        BookingStatusHistory h = new BookingStatusHistory();
        h.setBookingId(bookingId);
        h.setFromStatus(from);
        h.setToStatus(to);
        h.setChangedBy(changedBy);
        h.setNote(note);
        historyRepo.save(h);
    }

    private BookingResponse toResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId());
        r.setListingId(b.getListingId());
        r.setRenterId(b.getRenterId());
        r.setLandlordId(b.getLandlordId());
        r.setStartDate(b.getStartDate());
        r.setEndDate(b.getEndDate());
        r.setTotalAmount(b.getTotalAmount());
        r.setCurrency(b.getCurrency());
        r.setStatus(b.getStatus().name());
        r.setGuestsCount(b.getGuestsCount());
        r.setSpecialRequests(b.getSpecialRequests());
        r.setCancelledBy(b.getCancelledBy());
        r.setCancellationReason(b.getCancellationReason());
        r.setCreatedAt(b.getCreatedAt());
        r.setUpdatedAt(b.getUpdatedAt());

        List<BookingStatusHistory> history = historyRepo.findByBookingIdOrderByCreatedAtAsc(b.getId());
        r.setStatusHistory(history.stream().map(h -> {
            BookingResponse.StatusHistoryItem item = new BookingResponse.StatusHistoryItem();
            item.setId(h.getId());
            item.setFromStatus(h.getFromStatus());
            item.setToStatus(h.getToStatus());
            item.setChangedBy(h.getChangedBy());
            item.setNote(h.getNote());
            item.setCreatedAt(h.getCreatedAt());
            return item;
        }).toList());

        return r;
    }
}
