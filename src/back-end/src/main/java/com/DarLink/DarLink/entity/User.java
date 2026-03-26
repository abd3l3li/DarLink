package com.DarLink.DarLink.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users") // 'user' is a reserved keyword in Postgres, so we use 'users'
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)// Auto-incrementing ID
    private Long id;

    @NotBlank(message = "Username is required") // Validation: Cannot be null or empty
    @Size(min = 3, max = 20) // Validation: Must be between 3 and 20 characters
    @Column(unique = true, nullable = false) // DB Constraints: Must be unique and cannot be null
    private String username; 

    @NotBlank(message = "Email is required") // Validation: Cannot be null or empty
    @Email(message = "Must be a valid email") // Validation: Must be a valid email format
    @Column(unique = true, nullable = false) // DB Constraints: Must be unique and cannot be null
    private String email;

    @NotBlank(message = "Password is required")// Validation: Cannot be null or empty
    private String password;

    // --- Profile Fields (For Phase 3) ---
    private String bio;
    private String city;
    private String avatarUrl;

    @Column(name = "created_at", updatable = false) // DB Constraint: Cannot be updated after creation
    private LocalDateTime createdAt;

    // Default Constructor (Required by JPA)
    public User() {
    }

    // Constructor for Registration
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @Column(name = "totp_secret", nullable = true)
    private String totpSecret; // Stores the encrypted secret key (33 chars)

    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled = false; // Flag to check if 2FA is active

    @Column(name = "two_factor_verified", nullable = false)
    private Boolean twoFactorVerified = false; // Flag to check if user verified the setup

    // Getters and Setters
    public String getTotpSecret() { return totpSecret; }
    public void setTotpSecret(String totpSecret) { this.totpSecret = totpSecret; }

    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public Boolean getTwoFactorVerified() { return twoFactorVerified; }
    public void setTwoFactorVerified(Boolean twoFactorVerified) { this.twoFactorVerified = twoFactorVerified; }

    // Lifecycle Hook: Sets date before saving to DB
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters (No Lombok) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // toString (Good for debugging, but NEVER print passwords)
    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "', email='" + email + "'}";
    }
}