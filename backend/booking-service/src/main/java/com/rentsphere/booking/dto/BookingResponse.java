package com.rentsphere.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class BookingResponse {
    private UUID id;
    private UUID listingId;
    private UUID renterId;
    private UUID landlordId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private String currency;
    private String status;
    private Integer guestsCount;
    private String specialRequests;
    private UUID cancelledBy;
    private String cancellationReason;
    private List<StatusHistoryItem> statusHistory;
    private Instant createdAt;
    private Instant updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
    public UUID getRenterId() { return renterId; }
    public void setRenterId(UUID renterId) { this.renterId = renterId; }
    public UUID getLandlordId() { return landlordId; }
    public void setLandlordId(UUID landlordId) { this.landlordId = landlordId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getGuestsCount() { return guestsCount; }
    public void setGuestsCount(Integer guestsCount) { this.guestsCount = guestsCount; }
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    public UUID getCancelledBy() { return cancelledBy; }
    public void setCancelledBy(UUID cancelledBy) { this.cancelledBy = cancelledBy; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public List<StatusHistoryItem> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<StatusHistoryItem> statusHistory) { this.statusHistory = statusHistory; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static class StatusHistoryItem {
        private UUID id;
        private String fromStatus;
        private String toStatus;
        private UUID changedBy;
        private String note;
        private Instant createdAt;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getFromStatus() { return fromStatus; }
        public void setFromStatus(String fromStatus) { this.fromStatus = fromStatus; }
        public String getToStatus() { return toStatus; }
        public void setToStatus(String toStatus) { this.toStatus = toStatus; }
        public UUID getChangedBy() { return changedBy; }
        public void setChangedBy(UUID changedBy) { this.changedBy = changedBy; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }
}
