package com.DarLink.DarLink.dto;

import jakarta.validation.constraints.NotBlank;

public class Setup2FaRequest {
    @NotBlank(message = "TOTP code is required")
    private String totpCode; // 6-digit code from Google Authenticator

    public String getTotpCode() { return totpCode; }
    public void setTotpCode(String totpCode) { this.totpCode = totpCode; }
}
