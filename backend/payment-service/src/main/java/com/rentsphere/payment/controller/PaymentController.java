package com.rentsphere.payment.controller;

import com.rentsphere.payment.dto.*;
import com.rentsphere.payment.security.JwtUserPrincipal;
import com.rentsphere.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

    @GetMapping("/bookings/{bookingId}/summary")
    public ResponseEntity<Map<String, Object>> getPaymentSummary(@PathVariable UUID bookingId) {
        PaymentSummaryResponse result = paymentService.getPaymentSummary(bookingId);
        return ok("Payment summary retrieved", result);
    }

    @PostMapping("/bookings/{bookingId}/mock-pay")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> mockPay(@PathVariable UUID bookingId,
                                                        @AuthenticationPrincipal JwtUserPrincipal user) {
        PaymentResponse result = paymentService.mockPay(bookingId, user.userId());
        return ok("Mock payment completed", result);
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Map<String, Object>> getPayment(@PathVariable UUID paymentId,
                                                           @AuthenticationPrincipal JwtUserPrincipal user) {
        PaymentResponse result = paymentService.getPayment(paymentId, user.userId());
        return ok("Payment details retrieved", result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<Map<String, Object>> getMyPayments(@AuthenticationPrincipal JwtUserPrincipal user,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        Page<PaymentResponse> result = paymentService.getMyPayments(user.userId(), page, size);
        return ok("Payment history retrieved", result);
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> refund(@PathVariable UUID paymentId,
                                                       @Valid @RequestBody RefundRequest req) {
        RefundResponse result = paymentService.refund(paymentId, req);
        return ok("Refund initiated", result);
    }

    @GetMapping("/{paymentId}/escrow")
    public ResponseEntity<Map<String, Object>> getEscrow(@PathVariable UUID paymentId,
                                                          @AuthenticationPrincipal JwtUserPrincipal user) {
        List<RefundResponse> result = paymentService.getEscrow(paymentId, user.userId());
        return ok("Escrow records retrieved", result);
    }

    private ResponseEntity<Map<String, Object>> ok(String message, Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("path", "");
        return ResponseEntity.ok(body);
    }
}
