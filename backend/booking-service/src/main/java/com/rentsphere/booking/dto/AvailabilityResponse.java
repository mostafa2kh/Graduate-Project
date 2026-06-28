package com.rentsphere.booking.dto;

import java.util.List;

public class AvailabilityResponse {
    private boolean available;
    private List<DateRange> conflictingRanges;

    public AvailabilityResponse(boolean available, List<DateRange> conflictingRanges) {
        this.available = available;
        this.conflictingRanges = conflictingRanges;
    }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public List<DateRange> getConflictingRanges() { return conflictingRanges; }
    public void setConflictingRanges(List<DateRange> conflictingRanges) { this.conflictingRanges = conflictingRanges; }

    public static class DateRange {
        private String start;
        private String end;
        public DateRange(String start, String end) { this.start = start; this.end = end; }
        public String getStart() { return start; }
        public void setStart(String start) { this.start = start; }
        public String getEnd() { return end; }
        public void setEnd(String end) { this.end = end; }
    }
}
