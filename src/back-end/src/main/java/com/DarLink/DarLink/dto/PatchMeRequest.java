package com.DarLink.DarLink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchMeRequest {

    // Profile image URL (set to "" to clear)
    @Size(max = 1000, message = "Avatar URL must be at most 1000 characters")
    private String avatarUrl;

    // Account identity
    @Size(min = 3, max = 20, message = "Username must be 3 to 20 characters")
    private String username;

    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must be at most 255 characters")
    private String email;

    // Password change: requires currentPassword + newPassword
    @Size(min = 6, max = 200, message = "Current password must be 6 to 200 characters")
    private String currentPassword;

    @Size(min = 8, max = 200, message = "New password must be 8 to 200 characters")
    private String newPassword;

    // 2FA toggle
    private Boolean twoFactorEnabled;

    // Required only when enabling 2FA (if not already enabled)
    @Size(min = 6, max = 6, message = "TOTP code must be exactly 6 digits")
    private String totpCode;
}
