package com.rentsphere.aireview.service;

import com.rentsphere.aireview.dto.ReviewResponse;
import com.rentsphere.aireview.entity.ListingReview;
import com.rentsphere.aireview.entity.ReviewFlag;
import com.rentsphere.aireview.enums.FlagSeverity;
import com.rentsphere.aireview.enums.FlagType;
import com.rentsphere.aireview.repository.ListingReviewRepository;
import com.rentsphere.aireview.repository.ReviewFlagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class AiReviewService {

    private static final Logger log = LoggerFactory.getLogger(AiReviewService.class);
    private final ListingReviewRepository reviewRepository;
    private final ReviewFlagRepository flagRepository;
    private final Random random = new Random();

    public AiReviewService(ListingReviewRepository reviewRepository, ReviewFlagRepository flagRepository) {
        this.reviewRepository = reviewRepository;
        this.flagRepository = flagRepository;
    }

    @Transactional
    public ReviewResponse runReview(UUID listingId) {
        reviewRepository.findByListingId(listingId).ifPresent(r -> {
            throw new IllegalArgumentException("Listing already reviewed");
        });

        var review = new ListingReview();
        review.setListingId(listingId);
        int score = generateTrustScore(listingId);
        review.setTrustScore(score);
        review.setReviewedBy("AI_MOCK");
        review.setRerunCount(0);
        review.setSummary(generateSummary(score));
        review = reviewRepository.save(review);

        var flags = generateFlags(review, score);
        flags.forEach(flagRepository::save);

        log.info("Mock AI review completed for listing {}. Score: {}", listingId, score);
        return toResponse(review);
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReview(UUID listingId) {
        var review = reviewRepository.findByListingId(listingId)
                .orElseThrow(() -> new IllegalArgumentException("No review found for this listing"));
        return toResponse(review);
    }

    @Transactional
    public ReviewResponse rerunReview(UUID listingId, String reason) {
        var review = reviewRepository.findByListingId(listingId)
                .orElseThrow(() -> new IllegalArgumentException("No review found for this listing"));

        flagRepository.findByReviewIdOrderBySeverityAsc(review.getId()).forEach(flagRepository::delete);
        review.setRerunCount(review.getRerunCount() + 1);
        review.setReviewedAt(Instant.now());

        int score = generateTrustScore(listingId);
        review.setTrustScore(score);
        review.setSummary(generateSummary(score));
        review.setReviewedBy("ADMIN(" + reason + ")");
        review = reviewRepository.save(review);

        var flags = generateFlags(review, score);
        flags.forEach(flagRepository::save);

        log.info("Mock AI review rerun for listing {}. Score: {}. Reason: {}", listingId, score, reason);
        return toResponse(review);
    }

    private int generateTrustScore(UUID listingId) {
        int base = 60;
        int variance = random.nextInt(31);
        int noise = random.nextBoolean() ? variance : -variance;
        return Math.max(0, Math.min(100, base + noise));
    }

    private String generateSummary(int score) {
        if (score >= 80) return "Listing appears trustworthy. High confidence.";
        if (score >= 60) return "Listing meets basic requirements. Some minor concerns.";
        if (score >= 40) return "Listing has several issues that should be reviewed.";
        return "Listing raises significant concerns. Manual admin review strongly recommended.";
    }

    private List<ReviewFlag> generateFlags(ListingReview review, int score) {
        var flags = new ArrayList<ReviewFlag>();
        if (score < 80) {
            flags.add(createFlag(review, FlagType.INCOMPLETE_DESCRIPTION, FlagSeverity.INFO, "Description may be too short or generic"));
        }
        if (score < 70) {
            flags.add(createFlag(review, FlagType.MISSING_IMAGES, FlagSeverity.WARNING, "Fewer than recommended number of images"));
        }
        if (score < 60) {
            flags.add(createFlag(review, FlagType.SUSPICIOUS_PRICE, FlagSeverity.WARNING, "Price does not match typical range for area"));
        }
        if (score < 50) {
            flags.add(createFlag(review, FlagType.NO_AMENITIES, FlagSeverity.WARNING, "No amenities listed"));
        }
        if (score < 40) {
            flags.add(createFlag(review, FlagType.SUSPICIOUS_CONTENT, FlagSeverity.CRITICAL, "Listing content pattern raises concern"));
        }
        if (score < 30) {
            flags.add(createFlag(review, FlagType.UNVERIFIED_OWNER, FlagSeverity.CRITICAL, "Owner verification should be confirmed"));
        }
        return flags;
    }

    private ReviewFlag createFlag(ListingReview review, FlagType type, FlagSeverity severity, String desc) {
        var f = new ReviewFlag();
        f.setReview(review);
        f.setFlagType(type);
        f.setSeverity(severity);
        f.setDescription(desc);
        return f;
    }

    private ReviewResponse toResponse(ListingReview review) {
        var resp = new ReviewResponse();
        resp.setId(review.getId());
        resp.setListingId(review.getListingId());
        resp.setTrustScore(review.getTrustScore());
        resp.setSummary(review.getSummary());
        resp.setReviewedAt(review.getReviewedAt());
        resp.setReviewedBy(review.getReviewedBy());
        resp.setRerunCount(review.getRerunCount());

        var flags = flagRepository.findByReviewIdOrderBySeverityAsc(review.getId());
        var flagDtos = flags.stream().map(f -> {
            var d = new ReviewResponse.FlagDto();
            d.setId(f.getId());
            d.setFlagType(f.getFlagType().name());
            d.setSeverity(f.getSeverity().name());
            d.setDescription(f.getDescription());
            d.setCreatedAt(f.getCreatedAt());
            return d;
        }).toList();
        resp.setFlags(flagDtos);
        return resp;
    }
}
