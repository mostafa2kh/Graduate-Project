package com.rentsphere.payment.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> details = ex.getBindingResult().getFieldErrors().stream().map(e -> {
            Map<String, String> d = new LinkedHashMap<>();
            d.put("field", e.getField()); d.put("message", e.getDefaultMessage()); return d;
        }).toList();
        return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed", details);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadArg(IllegalArgumentException ex) {
        return error(HttpStatus.BAD_REQUEST, "BUSINESS_RULE_VIOLATION", ex.getMessage(), List.of());
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleDenied(AccessDeniedException ex) {
        return error(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "Access denied", List.of());
    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", ex.getMessage(), List.of());
    }
    private ResponseEntity<Map<String, Object>> error(HttpStatus s, String code, String msg, List<?> d) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false); body.put("message", msg); body.put("errorCode", code);
        body.put("details", d); body.put("timestamp", Instant.now().toString()); body.put("path", "");
        return ResponseEntity.status(s).body(body);
    }
}
