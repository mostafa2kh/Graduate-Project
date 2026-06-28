package com.rentsphere.moderation.repository;

import com.rentsphere.moderation.entity.ModerationDecision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModerationDecisionRepository extends JpaRepository<ModerationDecision, UUID> {
    List<ModerationDecision> findByModCaseIdOrderByCreatedAtDesc(UUID caseId);
}
