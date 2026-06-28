package com.rentsphere.gateway.controller;

import com.rentsphere.gateway.model.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/gateway")
public class GatewayController {

    @GetMapping("/health")
    public Mono<ResponseEntity<ApiResponse<Map<String, Object>>>> health() {
        Map<String, Object> data = Map.of(
                "status", "UP",
                "service", "api-gateway",
                "version", "0.0.1"
        );
        return Mono.just(ResponseEntity.ok(
                ApiResponse.ok(data, "Gateway is running", "/api/gateway/health")
        ));
    }
}
