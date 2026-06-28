package com.rentsphere.user.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class PreferencesResponse {

    private UUID id;
    private UUID userId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer preferredBedrooms;
    private Integer preferredBathrooms;
    private String propertyType;
    private String furnished;
    private boolean notificationEmail;
    private boolean notificationPush;
    private boolean notificationSms;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public Integer getPreferredBedrooms() { return preferredBedrooms; }
    public void setPreferredBedrooms(Integer preferredBedrooms) { this.preferredBedrooms = preferredBedrooms; }

    public Integer getPreferredBathrooms() { return preferredBathrooms; }
    public void setPreferredBathrooms(Integer preferredBathrooms) { this.preferredBathrooms = preferredBathrooms; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public String getFurnished() { return furnished; }
    public void setFurnished(String furnished) { this.furnished = furnished; }

    public boolean isNotificationEmail() { return notificationEmail; }
    public void setNotificationEmail(boolean notificationEmail) { this.notificationEmail = notificationEmail; }

    public boolean isNotificationPush() { return notificationPush; }
    public void setNotificationPush(boolean notificationPush) { this.notificationPush = notificationPush; }

    public boolean isNotificationSms() { return notificationSms; }
    public void setNotificationSms(boolean notificationSms) { this.notificationSms = notificationSms; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
