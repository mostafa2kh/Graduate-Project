package com.rentsphere.listing.controller;

import com.rentsphere.listing.dto.ListingRequest;
import com.rentsphere.listing.dto.ListingResponse;
import com.rentsphere.listing.dto.ListingSummaryResponse;
import com.rentsphere.listing.security.JwtUserPrincipal;
import com.rentsphere.listing.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) { this.listingService = listingService; }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createDraft(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @Valid @RequestBody ListingRequest request) {
        ListingResponse response = listingService.createDraft(principal.userId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wrap("Draft created", response, "/api/listings"));
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyListings(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            Pageable pageable) {
        Page<ListingSummaryResponse> page = listingService.getMyListings(principal.userId(), pageable);
        return ResponseEntity.ok(wrap("Listings retrieved", page, "/api/listings/my"));
    }

    @GetMapping("/my/{listingId}")
    public ResponseEntity<Map<String, Object>> getMyListingDetails(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId) {
        ListingResponse response = listingService.getMyListingDetails(listingId, principal.userId());
        return ResponseEntity.ok(wrap("Listing details retrieved", response, "/api/listings/my/" + listingId));
    }

    @PutMapping("/{listingId}")
    public ResponseEntity<Map<String, Object>> updateListing(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId,
            @Valid @RequestBody ListingRequest request) {
        ListingResponse response = listingService.updateListing(listingId, principal.userId(), request);
        return ResponseEntity.ok(wrap("Listing updated", response, "/api/listings/" + listingId));
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Map<String, Object>> deleteDraft(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId) {
        listingService.deleteDraft(listingId, principal.userId());
        return ResponseEntity.ok(wrap("Draft deleted", null, "/api/listings/" + listingId));
    }

    @PostMapping("/{listingId}/submit")
    public ResponseEntity<Map<String, Object>> submitForReview(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId) {
        ListingResponse response = listingService.submitForReview(listingId, principal.userId());
        return ResponseEntity.ok(wrap("Listing submitted for review", response, "/api/listings/" + listingId + "/submit"));
    }

    @GetMapping("/{listingId}/status-history")
    public ResponseEntity<Map<String, Object>> getStatusHistory(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId) {
        var history = listingService.getStatusHistory(listingId, principal.userId());
        return ResponseEntity.ok(wrap("Status history retrieved", history, "/api/listings/" + listingId + "/status-history"));
    }

    @GetMapping("/amenities")
    public ResponseEntity<Map<String, Object>> getAmenities() {
        var amenities = listingService.getAmenities();
        return ResponseEntity.ok(wrap("Amenities retrieved", amenities, "/api/listings/amenities"));
    }

    @PutMapping("/{listingId}/availability")
    public ResponseEntity<Map<String, Object>> updateAvailability(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId,
            @RequestBody List<ListingRequest.AvailabilityRequest> availability) {
        ListingResponse response = listingService.updateAvailability(listingId, principal.userId(), availability);
        return ResponseEntity.ok(wrap("Availability updated", response, "/api/listings/" + listingId + "/availability"));
    }

    private Map<String, Object> wrap(String message, Object data, String path) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true); body.put("message", message); body.put("data", data);
        body.put("timestamp", Instant.now().toString()); body.put("path", path);
        return body;
    }
}
