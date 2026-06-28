package com.rentsphere.moderation.dto;

import java.time.Instant;
import java.util.UUID;

public class ListingSummaryResponse {
    private UUID listingId;
    private String title;
    private String status;
    private String propertyType;
    private double price;
    private String currency;
    private int bedrooms;
    private int bathrooms;
    private String city;
    private String area;
    private String landlordName;
    private String landlordEmail;
    private Instant createdAt;
    private int trustScore;
    private int imageCount;
    private int flagCount;

    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }
    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getLandlordName() { return landlordName; }
    public void setLandlordName(String landlordName) { this.landlordName = landlordName; }
    public String getLandlordEmail() { return landlordEmail; }
    public void setLandlordEmail(String landlordEmail) { this.landlordEmail = landlordEmail; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public int getTrustScore() { return trustScore; }
    public void setTrustScore(int trustScore) { this.trustScore = trustScore; }
    public int getImageCount() { return imageCount; }
    public void setImageCount(int imageCount) { this.imageCount = imageCount; }
    public int getFlagCount() { return flagCount; }
    public void setFlagCount(int flagCount) { this.flagCount = flagCount; }
}
