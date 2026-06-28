package com.rentsphere.search.repository;

import com.rentsphere.search.entity.SearchableListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SearchableListingRepository extends JpaRepository<SearchableListing, UUID> {

    @Query("""
        SELECT s FROM SearchableListing s WHERE s.status = 'APPROVED'
        AND (:city IS NULL OR s.city LIKE %:city%)
        AND (:area IS NULL OR s.area LIKE %:area%)
        AND (:propertyType IS NULL OR s.propertyType = :propertyType)
        AND (:minPrice IS NULL OR s.price >= :minPrice)
        AND (:maxPrice IS NULL OR s.price <= :maxPrice)
        AND (:minBedrooms IS NULL OR s.bedrooms >= :minBedrooms)
        AND (:minBathrooms IS NULL OR s.bathrooms >= :minBathrooms)
        AND (:furnished IS NULL OR s.furnished = :furnished)
        """)
    Page<SearchableListing> searchListings(
            @Param("city") String city,
            @Param("area") String area,
            @Param("propertyType") String propertyType,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minBedrooms") Integer minBedrooms,
            @Param("minBathrooms") Integer minBathrooms,
            @Param("furnished") Boolean furnished,
            Pageable pageable);

    Optional<SearchableListing> findByIdAndStatus(UUID id, String status);

    boolean existsByIdAndStatus(UUID id, String status);

    @Query("SELECT DISTINCT s.city FROM SearchableListing s WHERE s.city IS NOT NULL AND s.status = 'APPROVED' ORDER BY s.city")
    List<String> findDistinctCities();

    @Query("SELECT DISTINCT s.propertyType FROM SearchableListing s WHERE s.propertyType IS NOT NULL AND s.status = 'APPROVED' ORDER BY s.propertyType")
    List<String> findDistinctPropertyTypes();
}
