package com.rentsphere.listing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ListingResponse {

    private UUID id;
    private UUID landlordId;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private String propertyType;
    private int bedrooms;
    private int bathrooms;
    private BigDecimal areaSize;
    private String areaUnit;
    private Integer yearBuilt;
    private String status;
    private boolean furnished;
    private boolean featured;
    private int viewsCount;

    private AddressDto address;
    private List<AmenityDto> amenities;
    private List<AvailabilityDto> availability;
    private List<StatusHistoryDto> statusHistory;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getLandlordId() { return landlordId; }
    public void setLandlordId(UUID landlordId) { this.landlordId = landlordId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }
    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }
    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }
    public BigDecimal getAreaSize() { return areaSize; }
    public void setAreaSize(BigDecimal areaSize) { this.areaSize = areaSize; }
    public String getAreaUnit() { return areaUnit; }
    public void setAreaUnit(String areaUnit) { this.areaUnit = areaUnit; }
    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isFurnished() { return furnished; }
    public void setFurnished(boolean furnished) { this.furnished = furnished; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public int getViewsCount() { return viewsCount; }
    public void setViewsCount(int viewsCount) { this.viewsCount = viewsCount; }
    public AddressDto getAddress() { return address; }
    public void setAddress(AddressDto address) { this.address = address; }
    public List<AmenityDto> getAmenities() { return amenities; }
    public void setAmenities(List<AmenityDto> amenities) { this.amenities = amenities; }
    public List<AvailabilityDto> getAvailability() { return availability; }
    public void setAvailability(List<AvailabilityDto> availability) { this.availability = availability; }
    public List<StatusHistoryDto> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<StatusHistoryDto> statusHistory) { this.statusHistory = statusHistory; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class AddressDto {
        private UUID id; private String street; private String city; private String area;
        private String state; private String zipCode; private String country;
        private java.math.BigDecimal latitude; private java.math.BigDecimal longitude;

        public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
        public String getStreet() { return street; } public void setStreet(String s) { this.street = s; }
        public String getCity() { return city; } public void setCity(String c) { this.city = c; }
        public String getArea() { return area; } public void setArea(String a) { this.area = a; }
        public String getState() { return state; } public void setState(String s) { this.state = s; }
        public String getZipCode() { return zipCode; } public void setZipCode(String z) { this.zipCode = z; }
        public String getCountry() { return country; } public void setCountry(String c) { this.country = c; }
        public java.math.BigDecimal getLatitude() { return latitude; } public void setLatitude(java.math.BigDecimal v) { this.latitude = v; }
        public java.math.BigDecimal getLongitude() { return longitude; } public void setLongitude(java.math.BigDecimal v) { this.longitude = v; }
    }

    public static class AmenityDto {
        private UUID id; private String name; private String category; private String icon;
        public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
        public String getName() { return name; } public void setName(String n) { this.name = n; }
        public String getCategory() { return category; } public void setCategory(String c) { this.category = c; }
        public String getIcon() { return icon; } public void setIcon(String i) { this.icon = i; }
    }

    public static class AvailabilityDto {
        private UUID id; private LocalDate startDate; private LocalDate endDate;
        private boolean available; private String notes;

        public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
        public LocalDate getStartDate() { return startDate; } public void setStartDate(LocalDate d) { this.startDate = d; }
        public LocalDate getEndDate() { return endDate; } public void setEndDate(LocalDate d) { this.endDate = d; }
        public boolean isAvailable() { return available; } public void setAvailable(boolean a) { this.available = a; }
        public String getNotes() { return notes; } public void setNotes(String n) { this.notes = n; }
    }

    public static class StatusHistoryDto {
        private UUID id; private String fromStatus; private String toStatus;
        private UUID changedBy; private String reason; private LocalDateTime createdAt;

        public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
        public String getFromStatus() { return fromStatus; } public void setFromStatus(String s) { this.fromStatus = s; }
        public String getToStatus() { return toStatus; } public void setToStatus(String s) { this.toStatus = s; }
        public UUID getChangedBy() { return changedBy; } public void setChangedBy(UUID c) { this.changedBy = c; }
        public String getReason() { return reason; } public void setReason(String r) { this.reason = r; }
        public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime c) { this.createdAt = c; }
    }
}
