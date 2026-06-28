package com.rentsphere.booking.controller;

import com.rentsphere.booking.dto.*;
import com.rentsphere.booking.security.JwtUserPrincipal;
import com.rentsphere.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) { this.bookingService = bookingService; }

    @PostMapping
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> createBooking(@Valid @RequestBody BookingRequest req,
                                                              @AuthenticationPrincipal JwtUserPrincipal user) {
        // landlordId would come from a lookup of the listing; for MVP we set it to a placeholder
        UUID landlordId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        BookingResponse result = bookingService.createBooking(req, user.userId(), landlordId);
        return ok("Booking request created", result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> getMyBookings(@AuthenticationPrincipal JwtUserPrincipal user,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        Page<BookingResponse> result = bookingService.getMyBookings(user.userId(), page, size);
        return ok("Bookings retrieved", result);
    }

    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> getLandlordBookings(@AuthenticationPrincipal JwtUserPrincipal user,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) {
        Page<BookingResponse> result = bookingService.getLandlordBookings(user.userId(), page, size);
        return ok("Booking requests retrieved", result);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Map<String, Object>> getBookingDetail(@PathVariable UUID bookingId,
                                                                 @AuthenticationPrincipal JwtUserPrincipal user) {
        BookingResponse result = bookingService.getBookingDetail(bookingId, user.userId());
        return ok("Booking details retrieved", result);
    }

    @PostMapping("/{bookingId}/accept")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> acceptBooking(@PathVariable UUID bookingId,
                                                              @AuthenticationPrincipal JwtUserPrincipal user) {
        BookingResponse result = bookingService.acceptBooking(bookingId, user.userId());
        return ok("Booking accepted", result);
    }

    @PostMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> rejectBooking(@PathVariable UUID bookingId,
                                                              @Valid @RequestBody RejectRequest req,
                                                              @AuthenticationPrincipal JwtUserPrincipal user) {
        BookingResponse result = bookingService.rejectBooking(bookingId, user.userId(), req);
        return ok("Booking rejected", result);
    }

    @PostMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable UUID bookingId,
                                                              @AuthenticationPrincipal JwtUserPrincipal user) {
        BookingResponse result = bookingService.cancelBooking(bookingId, user.userId());
        return ok("Booking cancelled", result);
    }

    @PostMapping("/{bookingId}/review")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> createReview(@PathVariable UUID bookingId,
                                                             @Valid @RequestBody ReviewRequest req,
                                                             @AuthenticationPrincipal JwtUserPrincipal user) {
        ReviewResponse result = bookingService.createReview(bookingId, user.userId(), req);
        return ok("Review created", result);
    }

    @GetMapping("/listings/{listingId}/reviews")
    public ResponseEntity<Map<String, Object>> getListingReviews(@PathVariable UUID listingId) {
        List<ReviewResponse> result = bookingService.getListingReviews(listingId);
        return ok("Reviews retrieved", result);
    }

    @GetMapping("/{bookingId}/review")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> getBookingReview(@PathVariable UUID bookingId,
                                                                 @AuthenticationPrincipal JwtUserPrincipal user) {
        ReviewResponse result = bookingService.getBookingReview(bookingId, user.userId());
        return ok("Review retrieved", result);
    }

    @GetMapping("/listings/{listingId}/availability-check")
    public ResponseEntity<Map<String, Object>> checkAvailability(@PathVariable UUID listingId,
                                                                  @RequestParam LocalDate startDate,
                                                                  @RequestParam LocalDate endDate) {
        AvailabilityResponse result = bookingService.checkAvailability(listingId, startDate, endDate);
        return ok("Availability checked", result);
    }

    private ResponseEntity<Map<String, Object>> ok(String message, Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("path", "");
        return ResponseEntity.ok(body);
    }
}
