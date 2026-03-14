package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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

    private Long hostId;
    private String hostUsername;

    private LocalDateTime createdAt;
}
