package com.DarLink.DarLink.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;



@Entity
@Table(name = "slot_requests")
public class SlotRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false) // 
    private User guest;

    @ManyToOne
    @JoinColumn(name = "stay_id", nullable = false)
    private Stay stay;

    // Dates
    private LocalDate startDate;
    private LocalDate endDate;

    private String status = "PENDING";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public SlotRequest() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

    public User getGuest() { return guest; }
    public void setGuest(User guest) { this.guest = guest; }

    public Stay getStay() { return stay; }
    public void setStay(Stay stay) {this.stay = stay; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}