package com.rentsphere.moderation.controller;

import com.rentsphere.moderation.dto.*;
import com.rentsphere.moderation.security.JwtUserPrincipal;
import com.rentsphere.moderation.service.ModerationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class ModerationController {

    private final ModerationService moderationService;

    public ModerationController(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(moderationService.getStats());
    }

    @GetMapping("/listings/pending")
    public ResponseEntity<List<ListingSummaryResponse>> getPendingListings() {
        return ResponseEntity.ok(moderationService.getPendingListings());
    }

    @GetMapping("/listings/{listingId}/review")
    public ResponseEntity<Map<String, Object>> getModerationDetail(@PathVariable UUID listingId) {
        return ResponseEntity.ok(moderationService.getModerationDetail(listingId));
    }

    @PostMapping("/listings/{listingId}/approve")
    public ResponseEntity<Map<String, Object>> approveListing(
            @PathVariable UUID listingId,
            @Valid @RequestBody ApprovalRequest request,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        return ResponseEntity.ok(moderationService.approveListing(listingId, principal.userId(), request.getNote()));
    }

    @PostMapping("/listings/{listingId}/reject")
    public ResponseEntity<Map<String, Object>> rejectListing(
            @PathVariable UUID listingId,
            @Valid @RequestBody RejectionRequest request,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        return ResponseEntity.ok(moderationService.rejectListing(listingId, principal.userId(), request.getReason()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getUsers() {
        return ResponseEntity.ok(moderationService.getUsers());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable UUID userId) {
        var users = moderationService.getUsers();
        var user = users.stream().filter(u -> u.getUserId().equals(userId)).findFirst();
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of("user", user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users/{userId}/disable")
    public ResponseEntity<Map<String, Object>> disableUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(moderationService.disableUser(userId));
    }

    @PostMapping("/users/{userId}/enable")
    public ResponseEntity<Map<String, Object>> enableUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(moderationService.enableUser(userId));
    }
}
