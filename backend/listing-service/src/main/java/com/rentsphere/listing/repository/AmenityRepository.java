package com.rentsphere.listing.repository;

import com.rentsphere.listing.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {
    List<Amenity> findAllByOrderByName();
}
