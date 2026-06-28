package com.rentsphere.moderation.repository;

import com.rentsphere.moderation.entity.ModerationCase;
import com.rentsphere.moderation.enums.ModerationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModerationCaseRepository extends JpaRepository<ModerationCase, UUID> {
    Optional<ModerationCase> findByListingId(UUID listingId);
    List<ModerationCase> findByStatusOrderByCreatedAtDesc(ModerationStatus status);
    long countByStatus(ModerationStatus status);
}
