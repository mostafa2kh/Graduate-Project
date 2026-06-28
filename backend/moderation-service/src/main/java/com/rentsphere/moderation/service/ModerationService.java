package com.rentsphere.moderation.service;

import com.rentsphere.moderation.client.AiReviewServiceClient;
import com.rentsphere.moderation.client.ListingServiceClient;
import com.rentsphere.moderation.dto.*;
import com.rentsphere.moderation.entity.ModerationCase;
import com.rentsphere.moderation.entity.ModerationDecision;
import com.rentsphere.moderation.enums.ModerationStatus;
import com.rentsphere.moderation.repository.ModerationCaseRepository;
import com.rentsphere.moderation.repository.ModerationDecisionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModerationService {

    private final ModerationCaseRepository caseRepository;
    private final ModerationDecisionRepository decisionRepository;
    private final ListingServiceClient listingClient;
    private final AiReviewServiceClient aiReviewClient;

    public ModerationService(ModerationCaseRepository caseRepository,
                             ModerationDecisionRepository decisionRepository,
                             ListingServiceClient listingClient,
                             AiReviewServiceClient aiReviewClient) {
        this.caseRepository = caseRepository;
        this.decisionRepository = decisionRepository;
        this.listingClient = listingClient;
        this.aiReviewClient = aiReviewClient;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        var resp = new DashboardStatsResponse();
        resp.setPendingReviews(caseRepository.countByStatus(ModerationStatus.PENDING));
        resp.setApprovedListings(caseRepository.countByStatus(ModerationStatus.APPROVED));
        resp.setRejectedListings(caseRepository.countByStatus(ModerationStatus.REJECTED));
        resp.setTotalListings(resp.getPendingReviews() + resp.getApprovedListings() + resp.getRejectedListings());

        var byStatus = new LinkedHashMap<String, Long>();
        byStatus.put("PENDING", resp.getPendingReviews());
        byStatus.put("APPROVED", resp.getApprovedListings());
        byStatus.put("REJECTED", resp.getRejectedListings());
        resp.setListingsByStatus(byStatus);

        resp.setTotalUsers(10);
        resp.setActiveUsers(8);
        resp.setNewListingsToday(3);
        return resp;
    }

    @Transactional(readOnly = true)
    public List<ListingSummaryResponse> getPendingListings() {
        var cases = caseRepository.findByStatusOrderByCreatedAtDesc(ModerationStatus.PENDING);
        return cases.stream().map(this::toListingSummary).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getModerationDetail(UUID listingId) {
        var modCase = caseRepository.findByListingId(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Moderation case not found"));

        var details = new LinkedHashMap<String, Object>();
        details.put("caseId", modCase.getId());
        details.put("listingId", modCase.getListingId());
        details.put("status", modCase.getStatus().name());

        var listing = listingClient.getListing(listingId);
        details.put("listing", listing);

        var review = aiReviewClient.getReview(listingId);
        details.put("aiReview", review);

        var decisions = decisionRepository.findByModCaseIdOrderByCreatedAtDesc(modCase.getId());
        details.put("decisions", decisions.stream().map(d -> {
            var dm = new LinkedHashMap<String, Object>();
            dm.put("id", d.getId());
            dm.put("decision", d.getDecision());
            dm.put("reason", d.getReason());
            dm.put("decidedBy", d.getDecidedBy());
            dm.put("createdAt", d.getCreatedAt());
            return dm;
        }).toList());

        return details;
    }

    public Map<String, Object> approveListing(UUID listingId, UUID adminId, String note) {
        var modCase = caseRepository.findByListingId(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Moderation case not found"));

        if (modCase.getStatus() != ModerationStatus.PENDING) {
            throw new IllegalArgumentException("Case is not pending");
        }

        modCase.setStatus(ModerationStatus.APPROVED);
        caseRepository.save(modCase);

        var decision = new ModerationDecision();
        decision.setModCase(modCase);
        decision.setDecision("APPROVED");
        decision.setReason(note);
        decision.setDecidedBy(adminId);
        decisionRepository.save(decision);

        listingClient.approveListing(listingId, adminId);

        var result = new LinkedHashMap<String, Object>();
        result.put("caseId", modCase.getId());
        result.put("listingId", listingId);
        result.put("status", "APPROVED");
        result.put("message", "Listing approved");
        return result;
    }

    public Map<String, Object> rejectListing(UUID listingId, UUID adminId, String reason) {
        var modCase = caseRepository.findByListingId(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Moderation case not found"));

        if (modCase.getStatus() != ModerationStatus.PENDING) {
            throw new IllegalArgumentException("Case is not pending");
        }

        modCase.setStatus(ModerationStatus.REJECTED);
        caseRepository.save(modCase);

        var decision = new ModerationDecision();
        decision.setModCase(modCase);
        decision.setDecision("REJECTED");
        decision.setReason(reason);
        decision.setDecidedBy(adminId);
        decisionRepository.save(decision);

        listingClient.rejectListing(listingId, reason, adminId);

        var result = new LinkedHashMap<String, Object>();
        result.put("caseId", modCase.getId());
        result.put("listingId", listingId);
        result.put("status", "REJECTED");
        result.put("message", "Listing rejected");
        return result;
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getUsers() {
        var users = new ArrayList<UserSummaryResponse>();
        for (int i = 1; i <= 5; i++) {
            var u = new UserSummaryResponse();
            u.setUserId(UUID.randomUUID());
            u.setEmail("user" + i + "@example.com");
            u.setFullName("User " + i);
            u.setRole(i == 1 ? "ROLE_ADMIN" : (i % 2 == 0 ? "ROLE_LANDLORD" : "ROLE_RENTER"));
            u.setEnabled(true);
            u.setCreatedAt(java.time.Instant.now().minus(java.time.Duration.ofDays(i * 10)));
            u.setListingCount(i * 2);
            u.setVerified(i % 2 == 0);
            users.add(u);
        }
        return users;
    }

    public Map<String, Object> disableUser(UUID userId) {
        return Map.of("userId", userId.toString(), "status", "DISABLED", "message", "User disabled (placeholder)");
    }

    public Map<String, Object> enableUser(UUID userId) {
        return Map.of("userId", userId.toString(), "status", "ENABLED", "message", "User enabled (placeholder)");
    }

    private ListingSummaryResponse toListingSummary(ModerationCase mc) {
        var resp = new ListingSummaryResponse();
        resp.setListingId(mc.getListingId());
        resp.setStatus(mc.getStatus().name());

        var listing = listingClient.getListing(mc.getListingId());
        resp.setTitle((String) listing.getOrDefault("title", "Untitled"));
        resp.setPropertyType((String) listing.getOrDefault("propertyType", ""));
        resp.setPrice(listing.get("price") instanceof Number n ? n.doubleValue() : 0);
        resp.setBedrooms(listing.get("bedrooms") instanceof Number n ? n.intValue() : 0);
        resp.setBathrooms(listing.get("bathrooms") instanceof Number n ? n.intValue() : 0);
        resp.setCreatedAt(mc.getCreatedAt());

        var address = (Map<String, Object>) listing.getOrDefault("address", Map.of());
        resp.setCity((String) address.getOrDefault("city", ""));
        resp.setArea((String) address.getOrDefault("area", ""));

        var review = aiReviewClient.getReview(mc.getListingId());
        resp.setTrustScore(review.get("trustScore") instanceof Number n ? n.intValue() : 0);
        var flags = (List<Map<String, Object>>) review.getOrDefault("flags", List.of());
        resp.setFlagCount(flags.size());

        return resp;
    }
}
