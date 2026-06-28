package com.rentsphere.payment.repository;

import com.rentsphere.payment.entity.PaymentTransaction;
import com.rentsphere.payment.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    Optional<PaymentTransaction> findByBookingId(UUID bookingId);
    Page<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    boolean existsByBookingIdAndStatus(UUID bookingId, PaymentStatus status);
}
