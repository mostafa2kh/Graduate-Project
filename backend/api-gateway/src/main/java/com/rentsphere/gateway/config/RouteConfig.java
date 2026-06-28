package com.rentsphere.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")

                        .uri("http://localhost:8081"))

                .route("user-service", r -> r
                        .path("/api/users/**")

                        .uri("http://localhost:8082"))

                .route("listing-service", r -> r
                        .path("/api/listings/**")

                        .uri("http://localhost:8083"))

                .route("media-service", r -> r
                        .path("/api/media/**")

                        .uri("http://localhost:8084"))

                .route("ai-review-service", r -> r
                        .path("/api/ai-review/**")

                        .uri("http://localhost:8085"))

                .route("audit-service", r -> r
                        .path("/api/admin/audit/**")

                        .uri("http://localhost:8093"))

                .route("verification-admin-service", r -> r
                        .path("/api/admin/verification/**")

                        .uri("http://localhost:8087"))

                .route("moderation-service", r -> r
                        .path("/api/admin/**")

                        .uri("http://localhost:8086"))

                .route("verification-service", r -> r
                        .path("/api/verification/**")

                        .uri("http://localhost:8087"))

                .route("search-service", r -> r
                        .path("/api/search/**")

                        .uri("http://localhost:8091"))

                .route("booking-service", r -> r
                        .path("/api/bookings/**")

                        .uri("http://localhost:8092"))

                .route("payment-service", r -> r
                        .path("/api/payments/**")

                        .uri("http://localhost:8088"))

                .route("chat-service", r -> r
                        .path("/api/chat/**")

                        .uri("http://localhost:8090"))

                .route("notification-service", r -> r
                        .path("/api/notifications/**")

                        .uri("http://localhost:8089"))

                .build();
    }
}
