package com.rentsphere.booking.dto;

import jakarta.validation.constraints.*;

public class ReviewRequest {
    @NotNull @Min(1) @Max(5) private Integer rating;
    @Size(max = 2048) private String comment;
    public Integer getRating() { return rating; } public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; } public void setComment(String comment) { this.comment = comment; }
}
