package com.rentsphere.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${USER_SERVICE_URL:http://localhost:8082}")
    private String userServiceUrl;

    @Value("${LISTING_SERVICE_URL:http://localhost:8083}")
    private String listingServiceUrl;

    @Value("${MEDIA_SERVICE_URL:http://localhost:8084}")
    private String mediaServiceUrl;

    @Value("${AI_REVIEW_SERVICE_URL:http://localhost:8085}")
    private String aiReviewServiceUrl;

    @Value("${MODERATION_SERVICE_URL:http://localhost:8086}")
    private String moderationServiceUrl;

    @Value("${VERIFICATION_SERVICE_URL:http://localhost:8087}")
    private String verificationServiceUrl;

    @Value("${PAYMENT_SERVICE_URL:http://localhost:8088}")
    private String paymentServiceUrl;

    @Value("${NOTIFICATION_SERVICE_URL:http://localhost:8089}")
    private String notificationServiceUrl;

    @Value("${CHAT_SERVICE_URL:http://localhost:8090}")
    private String chatServiceUrl;

    @Value("${SEARCH_SERVICE_URL:http://localhost:8091}")
    private String searchServiceUrl;

    @Value("${BOOKING_SERVICE_URL:http://localhost:8092}")
    private String bookingServiceUrl;

    @Value("${AUDIT_SERVICE_URL:http://localhost:8093}")
    private String auditServiceUrl;

    @Value("${AI_CHATBOT_SERVICE_URL:http://localhost:8095}")
    private String aiChatbotServiceUrl;

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")

                        .uri(authServiceUrl))

                .route("user-service", r -> r
                        .path("/api/users/**")

                        .uri(userServiceUrl))

                .route("listing-service", r -> r
                        .path("/api/listings/**")

                        .uri(listingServiceUrl))

                .route("media-service", r -> r
                        .path("/api/media/**")

                        .uri(mediaServiceUrl))

                .route("ai-review-service", r -> r
                        .path("/api/ai-review/**")

                        .uri(aiReviewServiceUrl))

                .route("audit-service", r -> r
                        .path("/api/admin/audit/**")

                        .uri(auditServiceUrl))

                .route("verification-admin-service", r -> r
                        .path("/api/admin/verification/**")

                        .uri(verificationServiceUrl))

                .route("moderation-service", r -> r
                        .path("/api/admin/**")

                        .uri(moderationServiceUrl))

                .route("verification-service", r -> r
                        .path("/api/verification/**")

                        .uri(verificationServiceUrl))

                .route("search-service", r -> r
                        .path("/api/search/**")

                        .uri(searchServiceUrl))

                .route("booking-service", r -> r
                        .path("/api/bookings/**")

                        .uri(bookingServiceUrl))

                .route("payment-service", r -> r
                        .path("/api/payments/**")

                        .uri(paymentServiceUrl))

                .route("chat-service", r -> r
                        .path("/api/chat/**")

                        .uri(chatServiceUrl))

                .route("notification-service", r -> r
                        .path("/api/notifications/**")

                        .uri(notificationServiceUrl))

                .route("ai-chatbot-service", r -> r
                        .path("/api/ai-chatbot/**")

                        .uri(aiChatbotServiceUrl))

                .build();
    }
}
