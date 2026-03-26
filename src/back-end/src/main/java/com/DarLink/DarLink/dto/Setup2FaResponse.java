package com.DarLink.DarLink.dto;

public class Setup2FaResponse {
    private String qrCodeUrl; // URL to generate QR code
    private String secret;    // Base32 secret (for manual entry)

    public Setup2FaResponse(String qrCodeUrl, String secret) {
        this.qrCodeUrl = qrCodeUrl;
        this.secret = secret;
    }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public String getSecret() { return secret; }
}
