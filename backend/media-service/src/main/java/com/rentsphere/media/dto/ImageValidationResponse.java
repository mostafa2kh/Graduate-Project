package com.rentsphere.media.dto;

public class ImageValidationResponse {
    private long currentCount;
    private long minRequired;
    private long maxAllowed;
    private boolean meetsMinimum;
    private boolean exceedsMaximum;
    private String message;

    public ImageValidationResponse(long currentCount, long minRequired, long maxAllowed) {
        this.currentCount = currentCount;
        this.minRequired = minRequired;
        this.maxAllowed = maxAllowed;
        this.meetsMinimum = currentCount >= minRequired;
        this.exceedsMaximum = currentCount > maxAllowed;
        if (currentCount < minRequired) {
            this.message = "At least " + minRequired + " images required. " + (minRequired - currentCount) + " more needed.";
        } else if (currentCount > maxAllowed) {
            this.message = "Maximum " + maxAllowed + " images allowed. Remove " + (currentCount - maxAllowed) + " images.";
        } else {
            this.message = "Image count meets requirements (" + currentCount + "/" + maxAllowed + ").";
        }
    }

    public long getCurrentCount() { return currentCount; }
    public long getMinRequired() { return minRequired; }
    public long getMaxAllowed() { return maxAllowed; }
    public boolean isMeetsMinimum() { return meetsMinimum; }
    public boolean isExceedsMaximum() { return exceedsMaximum; }
    public String getMessage() { return message; }
}
