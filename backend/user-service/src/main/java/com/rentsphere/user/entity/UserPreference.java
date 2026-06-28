package com.rentsphere.user.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "min_price")
    private BigDecimal minPrice;

    @Column(name = "max_price")
    private BigDecimal maxPrice;

    @Column(name = "preferred_bedrooms")
    private Integer preferredBedrooms;

    @Column(name = "preferred_bathrooms")
    private Integer preferredBathrooms;

    @Column(name = "property_type")
    private String propertyType;

    private String furnished;

    @Column(name = "notification_email")
    private boolean notificationEmail = true;

    @Column(name = "notification_push")
    private boolean notificationPush = true;

    @Column(name = "notification_sms")
    private boolean notificationSms = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
