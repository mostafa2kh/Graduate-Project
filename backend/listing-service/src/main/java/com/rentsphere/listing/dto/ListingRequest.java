package com.rentsphere.listing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public class ListingRequest {

    @NotBlank @Size(max = 255)
    private String title;

    @NotBlank @Size(min = 20, max = 5000)
    private String description;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    private String currency;

    @NotBlank
    private String propertyType;

    @Min(0) private int bedrooms;
    @Min(0) private int bathrooms;

    @DecimalMin("0.0")
    private BigDecimal areaSize;
    private String areaUnit;
    private Integer yearBuilt;
    private Boolean furnished;

    private AddressRequest address;
    private Set<String> amenityNames;

    @Valid
    private List<AvailabilityRequest> availability;

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
    public Boolean getFurnished() { return furnished; }
    public void setFurnished(Boolean furnished) { this.furnished = furnished; }
    public AddressRequest getAddress() { return address; }
    public void setAddress(AddressRequest address) { this.address = address; }
    public Set<String> getAmenityNames() { return amenityNames; }
    public void setAmenityNames(Set<String> amenityNames) { this.amenityNames = amenityNames; }
    public List<AvailabilityRequest> getAvailability() { return availability; }
    public void setAvailability(List<AvailabilityRequest> availability) { this.availability = availability; }

    public static class AddressRequest {
        private String street;
        @NotBlank private String city;
        @NotBlank private String area;
        private String state;
        private String zipCode;
        private String country;
        private BigDecimal latitude;
        private BigDecimal longitude;

        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getArea() { return area; }
        public void setArea(String area) { this.area = area; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getZipCode() { return zipCode; }
        public void setZipCode(String zipCode) { this.zipCode = zipCode; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
        public BigDecimal getLatitude() { return latitude; }
        public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
        public BigDecimal getLongitude() { return longitude; }
        public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    }

    public static class AvailabilityRequest {
        @NotNull private java.time.LocalDate startDate;
        @NotNull private java.time.LocalDate endDate;
        private Boolean available;
        private String notes;

        public java.time.LocalDate getStartDate() { return startDate; }
        public void setStartDate(java.time.LocalDate startDate) { this.startDate = startDate; }
        public java.time.LocalDate getEndDate() { return endDate; }
        public void setEndDate(java.time.LocalDate endDate) { this.endDate = endDate; }
        public Boolean getAvailable() { return available; }
        public void setAvailable(Boolean available) { this.available = available; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
