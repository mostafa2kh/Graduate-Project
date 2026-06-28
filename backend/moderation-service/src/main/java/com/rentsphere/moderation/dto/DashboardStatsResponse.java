package com.rentsphere.moderation.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalListings;
    private long pendingReviews;
    private long approvedListings;
    private long rejectedListings;
    private long totalUsers;
    private long activeUsers;
    private long newListingsToday;
    private Map<String, Long> listingsByStatus;

    public long getTotalListings() { return totalListings; }
    public void setTotalListings(long totalListings) { this.totalListings = totalListings; }
    public long getPendingReviews() { return pendingReviews; }
    public void setPendingReviews(long pendingReviews) { this.pendingReviews = pendingReviews; }
    public long getApprovedListings() { return approvedListings; }
    public void setApprovedListings(long approvedListings) { this.approvedListings = approvedListings; }
    public long getRejectedListings() { return rejectedListings; }
    public void setRejectedListings(long rejectedListings) { this.rejectedListings = rejectedListings; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public long getNewListingsToday() { return newListingsToday; }
    public void setNewListingsToday(long newListingsToday) { this.newListingsToday = newListingsToday; }
    public Map<String, Long> getListingsByStatus() { return listingsByStatus; }
    public void setListingsByStatus(Map<String, Long> listingsByStatus) { this.listingsByStatus = listingsByStatus; }
}
