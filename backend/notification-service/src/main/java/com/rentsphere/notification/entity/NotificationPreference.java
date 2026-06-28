package com.rentsphere.notification.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "email_notifications", nullable = false)
    private boolean emailNotifications = true;

    @Column(name = "push_notifications", nullable = false)
    private boolean pushNotifications = true;

    @Column(name = "listing_updates", nullable = false)
    private boolean listingUpdates = true;

    @Column(name = "booking_updates", nullable = false)
    private boolean bookingUpdates = true;

    @Column(name = "message_alerts", nullable = false)
    private boolean messageAlerts = true;

    @Column(name = "admin_announcements", nullable = false)
    private boolean adminAnnouncements = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public NotificationPreference() {}

    @PrePersist
    protected void onCreate() { createdAt = Instant.now(); updatedAt = Instant.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = Instant.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }
    public boolean isPushNotifications() { return pushNotifications; }
    public void setPushNotifications(boolean pushNotifications) { this.pushNotifications = pushNotifications; }
    public boolean isListingUpdates() { return listingUpdates; }
    public void setListingUpdates(boolean listingUpdates) { this.listingUpdates = listingUpdates; }
    public boolean isBookingUpdates() { return bookingUpdates; }
    public void setBookingUpdates(boolean bookingUpdates) { this.bookingUpdates = bookingUpdates; }
    public boolean isMessageAlerts() { return messageAlerts; }
    public void setMessageAlerts(boolean messageAlerts) { this.messageAlerts = messageAlerts; }
    public boolean isAdminAnnouncements() { return adminAnnouncements; }
    public void setAdminAnnouncements(boolean adminAnnouncements) { this.adminAnnouncements = adminAnnouncements; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
