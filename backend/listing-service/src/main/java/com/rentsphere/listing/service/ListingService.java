package com.rentsphere.listing.service;

import com.rentsphere.listing.dto.ListingRequest;
import com.rentsphere.listing.dto.ListingResponse;
import com.rentsphere.listing.dto.ListingSummaryResponse;
import com.rentsphere.listing.entity.*;
import com.rentsphere.listing.enums.ListingStatus;
import com.rentsphere.listing.mapper.ListingMapper;
import com.rentsphere.listing.repository.AmenityRepository;
import com.rentsphere.listing.repository.ListingRepository;
import com.rentsphere.listing.repository.ListingStatusHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final AmenityRepository amenityRepository;
    private final ListingStatusHistoryRepository statusHistoryRepository;

    public ListingService(ListingRepository listingRepository,
                          AmenityRepository amenityRepository,
                          ListingStatusHistoryRepository statusHistoryRepository) {
        this.listingRepository = listingRepository;
        this.amenityRepository = amenityRepository;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    @Transactional
    public ListingResponse createDraft(UUID landlordId, ListingRequest request) {
        Listing listing = new Listing();
        applyRequest(listing, request);
        listing.setLandlordId(landlordId);
        listing.setStatus(ListingStatus.DRAFT);

        listingRepository.save(listing);
        recordStatusChange(listing, null, ListingStatus.DRAFT, landlordId, "Draft created");
        return ListingMapper.toResponse(listing);
    }

    @Transactional
    public ListingResponse updateListing(UUID listingId, UUID userId, ListingRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getLandlordId().equals(userId))
            throw new RuntimeException("You do not own this listing");
        if (listing.getStatus() != ListingStatus.DRAFT)
            throw new RuntimeException("Only draft listings can be edited");

        applyRequest(listing, request);
        listingRepository.save(listing);
        return ListingMapper.toResponse(listing);
    }

    @Transactional
    public void deleteDraft(UUID listingId, UUID userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getLandlordId().equals(userId))
            throw new RuntimeException("You do not own this listing");
        if (listing.getStatus() != ListingStatus.DRAFT)
            throw new RuntimeException("Only draft listings can be deleted");
        listingRepository.delete(listing);
    }

    @Transactional
    public ListingResponse submitForReview(UUID listingId, UUID userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getLandlordId().equals(userId))
            throw new RuntimeException("You do not own this listing");
        if (listing.getStatus() != ListingStatus.DRAFT)
            throw new RuntimeException("Only draft listings can be submitted");

        validateRequired(listing);
        listing.setStatus(ListingStatus.PENDING_REVIEW);
        listingRepository.save(listing);
        recordStatusChange(listing, ListingStatus.DRAFT, ListingStatus.PENDING_REVIEW, userId, "Submitted for review");
        return ListingMapper.toResponse(listing);
    }

    public Page<ListingSummaryResponse> getMyListings(UUID landlordId, Pageable pageable) {
        return listingRepository.findByLandlordId(landlordId, pageable)
                .map(ListingMapper::toSummary);
    }

    public ListingResponse getMyListingDetails(UUID listingId, UUID userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getLandlordId().equals(userId))
            throw new RuntimeException("You do not own this listing");
        return ListingMapper.toResponse(listing);
    }

    public List<ListingResponse.StatusHistoryDto> getStatusHistory(UUID listingId, UUID userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getLandlordId().equals(userId))
            throw new RuntimeException("You do not own this listing");
        return statusHistoryRepository.findByListingIdOrderByCreatedAtDesc(listingId).stream()
                .map(h -> {
                    var d = new ListingResponse.StatusHistoryDto();
                    d.setId(h.getId());
                    d.setFromStatus(h.getFromStatus() != null ? h.getFromStatus().name() : null);
                    d.setToStatus(h.getToStatus().name());
                    d.setChangedBy(h.getChangedBy());
                    d.setReason(h.getReason());
                    d.setCreatedAt(h.getCreatedAt());
                    return d;
                }).toList();
    }

    public List<ListingResponse.AmenityDto> getAmenities() {
        return amenityRepository.findAllByOrderByName().stream()
                .map(a -> {
                    var d = new ListingResponse.AmenityDto();
                    d.setId(a.getId()); d.setName(a.getName());
                    d.setCategory(a.getCategory()); d.setIcon(a.getIcon());
                    return d;
                }).toList();
    }

    @Transactional
    public ListingResponse updateAvailability(UUID listingId, UUID userId, List<ListingRequest.AvailabilityRequest> availability) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getLandlordId().equals(userId))
            throw new RuntimeException("You do not own this listing");

        listing.getAvailability().clear();
        for (var req : availability) {
            var av = new ListingAvailability();
            av.setListing(listing);
            av.setStartDate(req.getStartDate());
            av.setEndDate(req.getEndDate());
            av.setAvailable(req.getAvailable() != null ? req.getAvailable() : true);
            av.setNotes(req.getNotes());
            listing.getAvailability().add(av);
        }
        listingRepository.save(listing);
        return ListingMapper.toResponse(listing);
    }

    private void applyRequest(Listing listing, ListingRequest request) {
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        if (request.getCurrency() != null) listing.setCurrency(request.getCurrency());
        listing.setPropertyType(request.getPropertyType());
        listing.setBedrooms(request.getBedrooms());
        listing.setBathrooms(request.getBathrooms());
        if (request.getAreaSize() != null) listing.setAreaSize(request.getAreaSize());
        if (request.getAreaUnit() != null) listing.setAreaUnit(request.getAreaUnit());
        if (request.getYearBuilt() != null) listing.setYearBuilt(request.getYearBuilt());
        if (request.getFurnished() != null) listing.setFurnished(request.getFurnished());

        if (request.getAddress() != null) {
            var addrReq = request.getAddress();
            ListingAddress addr = listing.getAddress();
            if (addr == null) {
                addr = new ListingAddress();
                addr.setListing(listing);
                listing.setAddress(addr);
            }
            addr.setStreet(addrReq.getStreet());
            addr.setCity(addrReq.getCity());
            addr.setArea(addrReq.getArea());
            addr.setState(addrReq.getState());
            addr.setZipCode(addrReq.getZipCode());
            addr.setCountry(addrReq.getCountry());
            addr.setLatitude(addrReq.getLatitude());
            addr.setLongitude(addrReq.getLongitude());
        }

        if (request.getAmenityNames() != null && !request.getAmenityNames().isEmpty()) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllByOrderByName());
            Set<Amenity> selected = amenities.stream()
                    .filter(a -> request.getAmenityNames().contains(a.getName()))
                    .collect(Collectors.toSet());
            listing.setAmenities(selected);
        }

        if (request.getAvailability() != null) {
            listing.getAvailability().clear();
            for (var req : request.getAvailability()) {
                var av = new ListingAvailability();
                av.setListing(listing);
                av.setStartDate(req.getStartDate());
                av.setEndDate(req.getEndDate());
                av.setAvailable(req.getAvailable() != null ? req.getAvailable() : true);
                av.setNotes(req.getNotes());
                listing.getAvailability().add(av);
            }
        }
    }

    private void validateRequired(Listing listing) {
        List<String> missing = new ArrayList<>();
        if (listing.getAddress() == null) missing.add("Address");
        if (listing.getTitle() == null || listing.getTitle().isBlank()) missing.add("Title");
        if (listing.getDescription() == null || listing.getDescription().length() < 20) missing.add("Description (min 20 chars)");
        if (listing.getPrice() == null || listing.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) missing.add("Price");
        if (listing.getAmenities() == null || listing.getAmenities().isEmpty()) missing.add("At least one amenity");
        if (listing.getAvailability() == null || listing.getAvailability().isEmpty()) missing.add("Availability dates");
        if (listing.getBedrooms() <= 0) missing.add("At least 1 bedroom");
        if (listing.getBathrooms() <= 0) missing.add("At least 1 bathroom");
        if (!missing.isEmpty())
            throw new IllegalArgumentException("Missing required fields: " + String.join(", ", missing));
    }

    private void recordStatusChange(Listing listing, ListingStatus from, ListingStatus to, UUID changedBy, String reason) {
        var history = new ListingStatusHistory();
        history.setListing(listing);
        history.setFromStatus(from);
        history.setToStatus(to);
        history.setChangedBy(changedBy);
        history.setReason(reason);
        statusHistoryRepository.save(history);
    }
}
