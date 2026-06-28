package com.rentsphere.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Order(0)
public class RequestLoggingFilter implements GlobalFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        var request = exchange.getRequest();
        var method = request.getMethod();
        var path = request.getURI().getPath();
        var query = request.getURI().getQuery();
        var correlationId = request.getHeaders().getFirst("X-Correlation-Id");

        String queryString = query != null ? "?" + query : "";
        log.info("[{}] {} {}{}", correlationId, method, path, queryString);

        long startTime = System.currentTimeMillis();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            var response = exchange.getResponse();
            long duration = System.currentTimeMillis() - startTime;
            log.info("[{}] {} {} {} ({}ms)",
                    correlationId, method, path, response.getStatusCode(), duration);
        }));
    }
}
