package com.rentsphere.payment.service;

import com.rentsphere.payment.dto.PaymentResponse;
import com.rentsphere.payment.dto.PaymentSummaryResponse;
import com.rentsphere.payment.dto.RefundRequest;
import com.rentsphere.payment.dto.RefundResponse;
import com.rentsphere.payment.entity.PaymentTransaction;
import com.rentsphere.payment.entity.Refund;
import com.rentsphere.payment.enums.PaymentStatus;
import com.rentsphere.payment.enums.RefundStatus;
import com.rentsphere.payment.repository.PaymentTransactionRepository;
import com.rentsphere.payment.repository.RefundRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private final PaymentTransactionRepository paymentRepo;
    private final RefundRepository refundRepo;

    public PaymentService(PaymentTransactionRepository paymentRepo, RefundRepository refundRepo) {
        this.paymentRepo = paymentRepo;
        this.refundRepo = refundRepo;
    }

    @Transactional(readOnly = true)
    public PaymentSummaryResponse getPaymentSummary(UUID bookingId) {
        var existing = paymentRepo.findByBookingId(bookingId);
        PaymentSummaryResponse res = new PaymentSummaryResponse();
        res.setBookingId(bookingId.toString());
        res.setListingTitle("Listing " + bookingId.toString().substring(0, 8) + "...");
        res.setAmount(0.0);
        res.setCurrency("USD");
        res.setPaymentStatus(existing.map(p -> p.getStatus().name()).orElse("NO_PAYMENT"));
        return res;
    }

    public PaymentResponse mockPay(UUID bookingId, UUID userId) {
        if (paymentRepo.existsByBookingIdAndStatus(bookingId, PaymentStatus.COMPLETED))
            throw new IllegalArgumentException("Payment already completed for this booking");

        if (paymentRepo.existsByBookingIdAndStatus(bookingId, PaymentStatus.PENDING))
            throw new IllegalArgumentException("Payment already in progress for this booking");

        PaymentTransaction pt = new PaymentTransaction();
        pt.setBookingId(bookingId);
        pt.setUserId(userId);
        pt.setAmount(new BigDecimal("0.00"));
        pt.setCurrency("USD");
        pt.setStatus(PaymentStatus.COMPLETED);
        pt.setPaymentMethod("STRIPE_MOCK");
        pt.setStripePaymentIntentId("pi_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        pt.setDescription("Mock payment for booking " + bookingId);
        pt.setPaidAt(Instant.now());
        pt = paymentRepo.save(pt);
        return toResponse(pt);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPayment(UUID paymentId, UUID userId) {
        PaymentTransaction pt = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (!pt.getUserId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return toResponse(pt);
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponse> getMyPayments(UUID userId, int page, int size) {
        return paymentRepo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    public RefundResponse refund(UUID paymentId, RefundRequest req) {
        PaymentTransaction pt = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (pt.getStatus() != PaymentStatus.COMPLETED)
            throw new IllegalArgumentException("Only completed payments can be refunded");

        Refund refund = new Refund();
        refund.setTransactionId(paymentId);
        refund.setAmount(req.getAmount());
        refund.setReason(req.getReason());
        refund.setStatus(RefundStatus.PENDING);
        refund = refundRepo.save(refund);

        pt.setStatus(PaymentStatus.REFUNDED);
        paymentRepo.save(pt);

        RefundResponse r = new RefundResponse();
        r.setId(refund.getId());
        r.setTransactionId(refund.getTransactionId());
        r.setAmount(refund.getAmount());
        r.setReason(refund.getReason());
        r.setStatus(refund.getStatus().name());
        r.setCreatedAt(refund.getCreatedAt());
        return r;
    }

    @Transactional(readOnly = true)
    public List<RefundResponse> getEscrow(UUID paymentId, UUID userId) {
        PaymentTransaction pt = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (!pt.getUserId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return refundRepo.findByTransactionId(paymentId).stream().map(refund -> {
            RefundResponse r = new RefundResponse();
            r.setId(refund.getId());
            r.setTransactionId(refund.getTransactionId());
            r.setAmount(refund.getAmount());
            r.setReason(refund.getReason());
            r.setStatus(refund.getStatus().name());
            r.setCreatedAt(refund.getCreatedAt());
            return r;
        }).toList();
    }

    private PaymentResponse toResponse(PaymentTransaction pt) {
        PaymentResponse r = new PaymentResponse();
        r.setId(pt.getId());
        r.setBookingId(pt.getBookingId());
        r.setUserId(pt.getUserId());
        r.setAmount(pt.getAmount());
        r.setCurrency(pt.getCurrency());
        r.setStatus(pt.getStatus().name());
        r.setPaymentMethod(pt.getPaymentMethod());
        r.setStripePaymentIntentId(pt.getStripePaymentIntentId());
        r.setDescription(pt.getDescription());
        r.setPaidAt(pt.getPaidAt());
        r.setCreatedAt(pt.getCreatedAt());
        return r;
    }
}
