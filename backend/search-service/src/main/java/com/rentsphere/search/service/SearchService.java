package com.rentsphere.search.service;

import com.rentsphere.search.dto.FiltersResponse;
import com.rentsphere.search.dto.ListingSearchResponse;
import com.rentsphere.search.dto.SearchRequest;
import com.rentsphere.search.entity.SearchableListing;
import com.rentsphere.search.repository.SearchableListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class SearchService {

    private final SearchableListingRepository repository;

    public SearchService(SearchableListingRepository repository) { this.repository = repository; }

    public Page<ListingSearchResponse> search(SearchRequest req) {
        Sort sort = switch (req.getSortBy()) {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            default -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), sort);

        return repository.searchListings(
                req.getCity(), req.getArea(), req.getPropertyType(),
                req.getMinPrice(), req.getMaxPrice(),
                req.getMinBedrooms(), req.getMinBathrooms(),
                req.getFurnished(), pageable
        ).map(this::toResponse);
    }

    public ListingSearchResponse getListingDetail(UUID listingId) {
        SearchableListing listing = repository.findByIdAndStatus(listingId, "APPROVED")
                .orElseThrow(() -> new IllegalArgumentException("Listing not found or not approved"));
        return toResponse(listing);
    }

    public FiltersResponse getFilterOptions() {
        var cities = repository.findDistinctCities();
        var types = repository.findDistinctPropertyTypes();
        return new FiltersResponse(cities, types, new FiltersResponse.PriceRange(0.0, 100000.0));
    }

    @Transactional
    public void reindexListing(UUID listingId) {
        // Placeholder - in full implementation, fetches from listing-service and saves
        throw new UnsupportedOperationException("Reindex from listing service not yet implemented");
    }

    @Transactional
    public void reindexAll() {
        // Placeholder
        throw new UnsupportedOperationException("Full reindex not yet implemented");
    }

    private ListingSearchResponse toResponse(SearchableListing l) {
        ListingSearchResponse r = new ListingSearchResponse();
        r.setId(l.getId()); r.setTitle(l.getTitle()); r.setDescription(l.getDescription());
        r.setPropertyType(l.getPropertyType()); r.setPrice(l.getPrice()); r.setCurrency(l.getCurrency());
        r.setBedrooms(l.getBedrooms()); r.setBathrooms(l.getBathrooms());
        r.setAreaSize(l.getAreaSize()); r.setAreaUnit(l.getAreaUnit()); r.setFurnished(l.getFurnished());
        r.setCity(l.getCity()); r.setArea(l.getArea()); r.setState(l.getState()); r.setCountry(l.getCountry());
        r.setLatitude(l.getLatitude()); r.setLongitude(l.getLongitude());
        r.setLandlordId(l.getLandlordId()); r.setPrimaryImageUrl(l.getPrimaryImageUrl());
        r.setTrustScore(l.getTrustScore()); r.setCreatedAt(l.getCreatedAt());
        return r;
    }
}
