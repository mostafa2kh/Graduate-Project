package com.rentsphere.search.controller;

import com.rentsphere.search.dto.FiltersResponse;
import com.rentsphere.search.dto.ListingSearchResponse;
import com.rentsphere.search.dto.SearchRequest;
import com.rentsphere.search.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) { this.searchService = searchService; }

    @GetMapping("/listings")
    public ResponseEntity<Map<String, Object>> searchListings(@Valid SearchRequest req) {
        Page<ListingSearchResponse> result = searchService.search(req);
        return ok("Listings retrieved successfully", result);
    }

    @GetMapping("/listings/{listingId}")
    public ResponseEntity<Map<String, Object>> getListingDetail(@PathVariable UUID listingId) {
        ListingSearchResponse listing = searchService.getListingDetail(listingId);
        return ok("Listing details retrieved successfully", listing);
    }

    @GetMapping("/filters/options")
    public ResponseEntity<Map<String, Object>> getFilterOptions() {
        FiltersResponse filters = searchService.getFilterOptions();
        return ok("Filter options retrieved successfully", filters);
    }

    @PostMapping("/reindex/{listingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> reindexListing(@PathVariable UUID listingId) {
        searchService.reindexListing(listingId);
        return ok("Reindex initiated", null);
    }

    @PostMapping("/reindex/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> reindexAll() {
        searchService.reindexAll();
        return ok("Full reindex initiated", null);
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
