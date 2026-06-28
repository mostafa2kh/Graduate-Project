package com.rentsphere.gateway.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.Instant;
import java.util.List;

@JsonPropertyOrder({"success", "message", "errorCode", "details", "timestamp", "path"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private boolean success;
    private String message;
    private String errorCode;
    private List<ErrorDetail> details;
    private String timestamp;
    private String path;

    public ErrorResponse() {
        this.success = false;
        this.timestamp = Instant.now().toString();
    }

    public static ErrorResponse of(String message, String errorCode, String path) {
        ErrorResponse response = new ErrorResponse();
        response.message = message;
        response.errorCode = errorCode;
        response.path = path;
        return response;
    }

    public static ErrorResponse of(String message, String errorCode, List<ErrorDetail> details, String path) {
        ErrorResponse response = of(message, errorCode, path);
        response.details = details;
        return response;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public List<ErrorDetail> getDetails() {
        return details;
    }

    public void setDetails(List<ErrorDetail> details) {
        this.details = details;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public static class ErrorDetail {
        private String field;
        private String message;

        public ErrorDetail() {}

        public ErrorDetail(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
