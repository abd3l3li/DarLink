package com.DarLink.DarLink.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "stays")
public class Stay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "City is required")
    private String city;

    private String address;

    private String roomType;

    @Min(value = 0, message = "Price cannot be negative")
    private Double pricePerNight;

    // NEW: Store multiple photos as JSON array
    @Column(columnDefinition = "TEXT")
    private String photos; // Stored as JSON: ["url1", "url2"]

    // Keep photoUrl for backward compatibility
    private String photoUrl;

    // NEW: Available slots/rooms
    @Min(value = 0, message = "Available slots cannot be negative")
    private Integer availableSlots;

    // NEW: What's included (JSON array)
    @Column(columnDefinition = "TEXT")
    private String included; // Stored as JSON: ["Wi-Fi", "Kitchen"]

    // NEW: Expectations/rules (JSON array)
    @Column(columnDefinition = "TEXT")
    private String expectations; // Stored as JSON: ["No smoking", "Quiet at night"]

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Stay() {}

    public Stay(String name, String city, Double pricePerNight, User host) {
        this.name = name;
        this.city = city;
        this.pricePerNight = pricePerNight;
        this.host = host;
        this.photos = "[]";
        this.included = "[]";
        this.expectations = "[]";
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.photos == null) this.photos = "[]";
        if (this.included == null) this.included = "[]";
        if (this.expectations == null) this.expectations = "[]";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getPhotos() { return photos; }
    public void setPhotos(String photos) { this.photos = photos; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public String getIncluded() { return included; }
    public void setIncluded(String included) { this.included = included; }

    public String getExpectations() { return expectations; }
    public void setExpectations(String expectations) { this.expectations = expectations; }

    public User getHost() { return host; }
    public void setHost(User host) { this.host = host; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}