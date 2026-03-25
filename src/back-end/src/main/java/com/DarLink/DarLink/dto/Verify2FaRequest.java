package com.DarLink.DarLink.dto;

import jakarta.validation.constraints.NotBlank;

public class Verify2FaRequest {
    @NotBlank(message = "TOTP code is required")
    private String totpCode;

    public String getTotpCode() { return totpCode; }
    public void setTotpCode(String totpCode) { this.totpCode = totpCode; }
}
