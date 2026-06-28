package com.rentsphere.moderation.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Component
public class ListingServiceClient {

    private final RestTemplate rest;

    public ListingServiceClient(@Value("${services.listing.url}") String baseUrl) {
        this.rest = new RestTemplate();
        this.rest.setUriTemplateHandler(new org.springframework.web.util.DefaultUriBuilderFactory(baseUrl));
    }

    public Map getListing(UUID listingId) {
        try {
            return rest.getForObject("/api/listings/my/" + listingId, Map.class);
        } catch (Exception e) {
            return Map.of("id", listingId.toString(), "error", "Could not fetch listing details");
        }
    }

    public void approveListing(UUID listingId, UUID adminId) {
        rest.postForObject("/api/listings/" + listingId + "/approve", Map.of("adminId", adminId.toString()), Map.class);
    }

    public void rejectListing(UUID listingId, String reason, UUID adminId) {
        rest.postForObject("/api/listings/" + listingId + "/reject", Map.of("reason", reason, "adminId", adminId.toString()), Map.class);
    }
}
