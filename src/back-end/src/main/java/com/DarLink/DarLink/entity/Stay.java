package com.DarLink.DarLink.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
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

    @Column(columnDefinition = "TEXT") // Allows long descriptions
    private String description;

    @NotBlank(message = "City is required")
    private String city;

    private String address;

    private  String roomType; // e.g., "Entire Place", "Private Room", "Shared Room"

    @Min(value = 0, message = "Price cannot be negative")
    private Double pricePerNight;

    // Stores photo URL (we will handle file upload in Phase 4)
    private String photoUrl; 
    
    // RELATIONS: A Stay belongs to one Host (User)
    @ManyToOne(fetch = FetchType.LAZY)  // fetch = FetchType.LAZY means we only load the host when we need it
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
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

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

    public User getHost() { return host; }
    public void setHost(User host) { this.host = host; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}