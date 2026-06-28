package com.rentsphere.moderation.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Component
public class AiReviewServiceClient {

    private final RestTemplate rest;

    public AiReviewServiceClient(@Value("${services.ai-review.url}") String baseUrl) {
        this.rest = new RestTemplate();
        this.rest.setUriTemplateHandler(new org.springframework.web.util.DefaultUriBuilderFactory(baseUrl));
    }

    public Map getReview(UUID listingId) {
        try {
            return rest.getForObject("/api/ai-review/listings/" + listingId, Map.class);
        } catch (Exception e) {
            return Map.of("listingId", listingId.toString(), "trustScore", 0, "error", "Could not fetch review");
        }
    }
}
