package com.rentsphere.aireview.controller;

import com.rentsphere.aireview.dto.ReviewResponse;
import com.rentsphere.aireview.dto.RerunRequest;
import com.rentsphere.aireview.security.JwtUserPrincipal;
import com.rentsphere.aireview.service.AiReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai-review")
public class AiReviewController {

    private final AiReviewService aiReviewService;

    public AiReviewController(AiReviewService aiReviewService) {
        this.aiReviewService = aiReviewService;
    }

    @PostMapping("/listings/{listingId}/review")
    public ResponseEntity<ReviewResponse> triggerReview(@PathVariable UUID listingId) {
        return ResponseEntity.ok(aiReviewService.runReview(listingId));
    }

    @GetMapping("/listings/{listingId}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable UUID listingId) {
        return ResponseEntity.ok(aiReviewService.getReview(listingId));
    }

    @GetMapping("/listings/{listingId}/flags")
    public ResponseEntity<ReviewResponse> getReviewWithFlags(@PathVariable UUID listingId) {
        var review = aiReviewService.getReview(listingId);
        if (review.getFlags() == null) {
            review.setFlags(java.util.List.of());
        }
        return ResponseEntity.ok(review);
    }

    @PostMapping("/listings/{listingId}/rerun")
    public ResponseEntity<ReviewResponse> rerunReview(
            @PathVariable UUID listingId,
            @Valid @RequestBody RerunRequest request,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        if (!principal.roles().contains("ROLE_ADMIN")) {
            throw new org.springframework.security.access.AccessDeniedException("Only admin can rerun review");
        }
        return ResponseEntity.ok(aiReviewService.rerunReview(listingId, request.getReason()));
    }
}
