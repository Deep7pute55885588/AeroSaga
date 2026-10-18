package com.aerosaga.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "aerosaga")
public record AeroSagaProperties(Temporal temporal, Cors cors) {

    public record Temporal(String serviceAddress, String namespace, String taskQueue) {
    }

    public record Cors(String allowedOrigin) {
    }
}
