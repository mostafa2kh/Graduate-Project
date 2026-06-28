package com.rentsphere.notification.dto;

public class NotificationPreferenceResponse {
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean listingUpdates;
    private boolean bookingUpdates;
    private boolean messageAlerts;
    private boolean adminAnnouncements;

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
}
