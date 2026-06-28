package com.rentsphere.listing.entity;

import com.rentsphere.listing.enums.ListingStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "listings")
public class Listing {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "landlord_id", nullable = false)
    private UUID landlordId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(length = 3)
    private String currency = "USD";

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType;

    @Column(nullable = false)
    private int bedrooms;

    @Column(nullable = false)
    private int bathrooms;

    @Column(name = "area_size", precision = 10, scale = 2)
    private BigDecimal areaSize;

    @Column(name = "area_unit", length = 10)
    private String areaUnit = "sqft";

    @Column(name = "year_built")
    private Integer yearBuilt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ListingStatus status = ListingStatus.DRAFT;

    @Column(name = "is_furnished")
    private boolean furnished;

    @Column(name = "is_featured")
    private boolean featured;

    @Column(name = "views_count")
    private int viewsCount;

    @OneToOne(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private ListingAddress address;

    @ManyToMany
    @JoinTable(name = "listing_amenities",
            joinColumns = @JoinColumn(name = "listing_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    private Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ListingAvailability> availability = new HashSet<>();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ListingStatusHistory> statusHistory = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getLandlordId() { return landlordId; }
    public void setLandlordId(UUID landlordId) { this.landlordId = landlordId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }
    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }
    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }
    public BigDecimal getAreaSize() { return areaSize; }
    public void setAreaSize(BigDecimal areaSize) { this.areaSize = areaSize; }
    public String getAreaUnit() { return areaUnit; }
    public void setAreaUnit(String areaUnit) { this.areaUnit = areaUnit; }
    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }
    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }
    public boolean isFurnished() { return furnished; }
    public void setFurnished(boolean furnished) { this.furnished = furnished; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public int getViewsCount() { return viewsCount; }
    public void setViewsCount(int viewsCount) { this.viewsCount = viewsCount; }
    public ListingAddress getAddress() { return address; }
    public void setAddress(ListingAddress address) { this.address = address; if (address != null) address.setListing(this); }
    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }
    public Set<ListingAvailability> getAvailability() { return availability; }
    public void setAvailability(Set<ListingAvailability> availability) { this.availability = availability; }
    public Set<ListingStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(Set<ListingStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
