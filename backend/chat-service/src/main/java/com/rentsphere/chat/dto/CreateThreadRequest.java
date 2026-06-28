package com.rentsphere.chat.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateThreadRequest {
    @NotNull
    private UUID otherParticipantId;
    private UUID listingId;

    public UUID getOtherParticipantId() { return otherParticipantId; }
    public void setOtherParticipantId(UUID otherParticipantId) { this.otherParticipantId = otherParticipantId; }
    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
}
