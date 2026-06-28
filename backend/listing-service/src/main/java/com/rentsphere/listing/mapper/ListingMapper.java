package com.rentsphere.listing.mapper;

import com.rentsphere.listing.dto.ListingRequest;
import com.rentsphere.listing.dto.ListingResponse;
import com.rentsphere.listing.dto.ListingSummaryResponse;
import com.rentsphere.listing.entity.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class ListingMapper {

    public static ListingResponse toResponse(Listing listing) {
        ListingResponse r = new ListingResponse();
        r.setId(listing.getId());
        r.setLandlordId(listing.getLandlordId());
        r.setTitle(listing.getTitle());
        r.setDescription(listing.getDescription());
        r.setPrice(listing.getPrice());
        r.setCurrency(listing.getCurrency());
        r.setPropertyType(listing.getPropertyType());
        r.setBedrooms(listing.getBedrooms());
        r.setBathrooms(listing.getBathrooms());
        r.setAreaSize(listing.getAreaSize());
        r.setAreaUnit(listing.getAreaUnit());
        r.setYearBuilt(listing.getYearBuilt());
        r.setStatus(listing.getStatus().name());
        r.setFurnished(listing.isFurnished());
        r.setFeatured(listing.isFeatured());
        r.setViewsCount(listing.getViewsCount());
        r.setCreatedAt(listing.getCreatedAt());
        r.setUpdatedAt(listing.getUpdatedAt());

        Optional.ofNullable(listing.getAddress()).ifPresent(a -> {
            ListingResponse.AddressDto d = new ListingResponse.AddressDto();
            d.setId(a.getId()); d.setStreet(a.getStreet()); d.setCity(a.getCity());
            d.setArea(a.getArea()); d.setState(a.getState()); d.setZipCode(a.getZipCode());
            d.setCountry(a.getCountry()); d.setLatitude(a.getLatitude()); d.setLongitude(a.getLongitude());
            r.setAddress(d);
        });

        r.setAmenities(listing.getAmenities().stream().map(a -> {
            ListingResponse.AmenityDto d = new ListingResponse.AmenityDto();
            d.setId(a.getId()); d.setName(a.getName()); d.setCategory(a.getCategory()); d.setIcon(a.getIcon());
            return d;
        }).toList());

        r.setAvailability(listing.getAvailability().stream().map(a -> {
            ListingResponse.AvailabilityDto d = new ListingResponse.AvailabilityDto();
            d.setId(a.getId()); d.setStartDate(a.getStartDate()); d.setEndDate(a.getEndDate());
            d.setAvailable(a.isAvailable()); d.setNotes(a.getNotes());
            return d;
        }).toList());

        r.setStatusHistory(listing.getStatusHistory().stream().map(h -> {
            ListingResponse.StatusHistoryDto d = new ListingResponse.StatusHistoryDto();
            d.setId(h.getId());
            d.setFromStatus(h.getFromStatus() != null ? h.getFromStatus().name() : null);
            d.setToStatus(h.getToStatus().name());
            d.setChangedBy(h.getChangedBy()); d.setReason(h.getReason()); d.setCreatedAt(h.getCreatedAt());
            return d;
        }).toList());

        return r;
    }

    public static ListingSummaryResponse toSummary(Listing listing) {
        ListingSummaryResponse r = new ListingSummaryResponse();
        r.setId(listing.getId());
        r.setTitle(listing.getTitle());
        r.setPrice(listing.getPrice());
        r.setCurrency(listing.getCurrency());
        r.setPropertyType(listing.getPropertyType());
        r.setBedrooms(listing.getBedrooms());
        r.setBathrooms(listing.getBathrooms());
        r.setAreaSize(listing.getAreaSize());
        r.setStatus(listing.getStatus().name());
        r.setFeatured(listing.isFeatured());
        r.setCreatedAt(listing.getCreatedAt());
        r.setUpdatedAt(listing.getUpdatedAt());

        Optional.ofNullable(listing.getAddress()).ifPresent(a -> {
            r.setCity(a.getCity());
            r.setArea(a.getArea());
        });

        return r;
    }
}
