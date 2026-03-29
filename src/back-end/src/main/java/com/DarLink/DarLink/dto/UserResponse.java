package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String city;
    private String avatarUrl;
    private Boolean twoFactorEnabled;
    private Boolean twoFactorVerified;
    private LocalDateTime createdAt;
    private String token;  // ADD THIS
}