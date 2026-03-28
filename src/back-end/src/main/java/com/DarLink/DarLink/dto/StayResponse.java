package com.DarLink.DarLink.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class StayResponse {

    private Long id;
    private String name;
    private String description;
    private String city;
    private String address;
    private Double pricePerNight;
    private String photoUrl;
    private String roomType;

    // NEW: Additional fields to match frontend
    @JsonProperty("avSlots")
    private Integer availableSlots;

    private List<String> photos = new ArrayList<>();
    private List<String> included = new ArrayList<>();
    private List<String> expectations = new ArrayList<>();

    // Host/Owner information
    private Long hostId;
    private String hostUsername;
    private String hostAvatarUrl;

    // Owner object (nested)
    private OwnerResponse owner;

    private LocalDateTime createdAt;

    // Helper class for nested owner object
    @Getter
    @Setter
    @NoArgsConstructor
    public static class OwnerResponse {
        private Long id;
        private String name;
        private String image;

        public OwnerResponse(Long id, String name, String image) {
            this.id = id;
            this.name = name;
            this.image = image;
        }
    }
}
