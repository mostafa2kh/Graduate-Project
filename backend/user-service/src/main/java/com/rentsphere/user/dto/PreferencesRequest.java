package com.rentsphere.user.dto;

import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

public class PreferencesRequest {

    @DecimalMin(value = "0.0", message = "Min price must be non-negative")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.0", message = "Max price must be non-negative")
    private BigDecimal maxPrice;

    private Integer preferredBedrooms;
    private Integer preferredBathrooms;
    private String propertyType;
    private String furnished;
    private Boolean notificationEmail;
    private Boolean notificationPush;
    private Boolean notificationSms;

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

    public Boolean getNotificationEmail() { return notificationEmail; }
    public void setNotificationEmail(Boolean notificationEmail) { this.notificationEmail = notificationEmail; }

    public Boolean getNotificationPush() { return notificationPush; }
    public void setNotificationPush(Boolean notificationPush) { this.notificationPush = notificationPush; }

    public Boolean getNotificationSms() { return notificationSms; }
    public void setNotificationSms(Boolean notificationSms) { this.notificationSms = notificationSms; }
}
