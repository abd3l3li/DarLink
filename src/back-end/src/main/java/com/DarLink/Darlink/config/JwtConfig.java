package com.DarLink.Darlink.config;

import org.springframework.boot.context.properties.ConfigurationProperties; // Import for @ConfigurationProperties
import org.springframework.context.annotation.Configuration; // Import for @Configuration

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private String secret;
    private long expiration;

    // Default Constructor
    public JwtConfig() {
    }

    // --- Getters and Setters (No Lombok) ---

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}