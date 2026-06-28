package com.rentsphere.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.Map;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class SwaggerConfig {

    @Bean
    public RouterFunction<ServerResponse> swaggerIndex() {
        return RouterFunctions.route(
                GET("/swagger").or(GET("/swagger-ui.html"))
                        .and(accept(MediaType.TEXT_HTML)),
                request -> ServerResponse.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .bodyValue("""
                                <!DOCTYPE html>
                                <html>
                                <head><title>RentSphere API Documentation</title>
                                <style>
                                    body { font-family: Inter, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #F8FAFC; }
                                    h1 { color: #0F172A; }
                                    .service { background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 12px 0; }
                                    .service h2 { margin: 0 0 4px; font-size: 18px; color: #2563EB; }
                                    .service p { margin: 0; color: #64748B; font-size: 14px; }
                                    a { text-decoration: none; }
                                </style>
                                </head>
                                <body>
                                    <h1>RentSphere API Documentation</h1>
                                    <p>Select a service to view its Swagger UI:</p>
                                    <a href='/swagger-ui.html'><div class='service'><h2>API Gateway</h2><p>Gateway health and routing</p></div></a>
                                    <a href='http://localhost:8081/swagger-ui.html' target='_blank'><div class='service'><h2>Auth Service</h2><p>Authentication, registration, login</p></div></a>
                                    <a href='http://localhost:8082/swagger-ui.html' target='_blank'><div class='service'><h2>User Service</h2><p>User profiles and preferences</p></div></a>
                                    <a href='http://localhost:8083/swagger-ui.html' target='_blank'><div class='service'><h2>Listing Service</h2><p>Listing CRUD and management</p></div></a>
                                    <p style='margin-top: 24px; color: #94A3B8; font-size: 13px;'>RentSphere — Microservices API Documentation</p>
                                </body>
                                </html>
                                """)
        );
    }

    @Bean
    public RouterFunction<ServerResponse> swaggerResources() {
        return RouterFunctions.route(
                GET("/api/gateway/swagger-resources"),
                request -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(Map.of(
                                "services", new String[]{
                                        "auth-service", "user-service", "listing-service",
                                        "media-service", "ai-review-service", "moderation-service",
                                        "verification-service", "search-service", "booking-service",
                                        "payment-service", "chat-service", "notification-service",
                                        "audit-service"
                                }
                        ))
        );
    }
}
