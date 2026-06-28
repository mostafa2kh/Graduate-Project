package com.rentsphere.auth.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<Map<String, String>> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage()))
                .toList();

        return ResponseEntity.badRequest().body(errorBody(
                "Validation failed", "VALIDATION_ERROR", details, request.getRequestURI()
        ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody(
                "Invalid email or password", "AUTHENTICATION_FAILED", null, request.getRequestURI()
        ));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(
            UsernameNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody(
                "Invalid email or password", "AUTHENTICATION_FAILED", null, request.getRequestURI()
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request) {
        return ResponseEntity.badRequest().body(errorBody(
                ex.getMessage(), "VALIDATION_ERROR", null, request.getRequestURI()
        ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(
            RuntimeException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody(
                "An unexpected error occurred", "INTERNAL_ERROR", null, request.getRequestURI()
        ));
    }

    private Map<String, Object> errorBody(String message, String errorCode,
                                          List<Map<String, String>> details, String path) {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("success", false);
        body.put("message", message);
        body.put("errorCode", errorCode);
        body.put("details", details);
        body.put("timestamp", Instant.now().toString());
        body.put("path", path);
        return body;
    }
}
