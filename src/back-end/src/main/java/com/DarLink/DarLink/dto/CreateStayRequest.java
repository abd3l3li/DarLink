package com.DarLink.DarLink.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreateStayRequest {

    // Optional to support the doc payload that may omit "name"
    @Size(max = 100, message = "Stay name must be at most 100 characters")
    private String name;

    @JsonAlias({"details"})
    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @JsonAlias({"location"})
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must be at most 100 characters")
    private String city;

    @Size(max = 255, message = "Address must be at most 255 characters")
    private String address;

    @JsonAlias({"type"})
    @Size(max = 50, message = "Room type must be at most 50 characters")
    private String roomType;

    @JsonAlias({"price"})
    @DecimalMin(value = "0.0", inclusive = true, message = "Price per night cannot be negative")
    private Double pricePerNight;

    @Size(max = 1000, message = "Photo URL must be at most 1000 characters")
    private String photoUrl;

    private List<String> photos;

    @JsonAlias({"avSlots"})
    @Min(value = 0, message = "Available slots cannot be negative")
    private Integer availableSlots;

    private List<String> included;
    private List<String> expectations;
}