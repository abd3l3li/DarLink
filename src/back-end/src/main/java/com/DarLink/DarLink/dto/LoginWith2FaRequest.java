package com.DarLink.DarLink.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginWith2FaRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "TOTP code is required")
    private String totpCode;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTotpCode() { return totpCode; }
    public void setTotpCode(String totpCode) { this.totpCode = totpCode; }
}