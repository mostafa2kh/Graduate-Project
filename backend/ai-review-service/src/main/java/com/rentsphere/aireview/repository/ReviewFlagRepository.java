package com.rentsphere.aireview.repository;

import com.rentsphere.aireview.entity.ReviewFlag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewFlagRepository extends JpaRepository<ReviewFlag, UUID> {
    List<ReviewFlag> findByReviewIdOrderBySeverityAsc(UUID reviewId);
}
