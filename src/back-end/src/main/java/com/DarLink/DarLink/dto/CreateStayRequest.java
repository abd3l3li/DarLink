package com.DarLink.DarLink.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateStayRequest {

    @NotBlank(message = "Stay name is required")
    @Size(max = 100, message = "Stay name must be at most 100 characters")
    private String name;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must be at most 100 characters")
    private String city;

    @Size(max = 255, message = "Address must be at most 255 characters")
    private String address;

    @DecimalMin(value = "0.0", inclusive = true, message = "Price per night cannot be negative")
    private Double pricePerNight;

    @Size(max = 1000, message = "Photo URL must be at most 1000 characters")
    private String photoUrl;
}
