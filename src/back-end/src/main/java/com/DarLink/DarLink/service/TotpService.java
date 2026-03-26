package com.DarLink.DarLink.service;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.exceptions.CodeGenerationException;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

@Service
public class TotpService {

    private final SecretGenerator secretGenerator;
    private final CodeVerifier codeVerifier;
    private final CodeGenerator codeGenerator;
    private final TimeProvider timeProvider;

    public TotpService() {
        this.secretGenerator = new DefaultSecretGenerator(32); // 32 bytes = 256 bits
        this.codeGenerator = new DefaultCodeGenerator();
        this.timeProvider = new SystemTimeProvider();
        this.codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);

    }

    /**
     * Generate a new TOTP secret for a user
     * @return Base32 encoded secret (33 chars)
     */
    public String generateSecret() {
        return secretGenerator.generate();
    }

    /**
     * Generate the QR code URL for Google Authenticator
     * @param email User's email
     * @param secret TOTP secret
     * @param issuer App name (e.g., "DarLink")
     * @return URL to generate QR code from
     */
    public String getQrCodeUrl(String email, String secret, String issuer) {
        return String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s",
                issuer,
                email,
                secret,
                issuer
        );
    }

    /**
     * Verify a TOTP code entered by user
     * @param code 6-digit code from Google Authenticator
     * @param secret User's stored TOTP secret
     * @return true if valid, false otherwise
     */
    public boolean verifyCode(String code, String secret) throws CodeGenerationException {
        return codeVerifier.isValidCode(secret, code);
    }

    /**
     * Generate current TOTP code (for testing purposes only)
     * @param secret User's stored TOTP secret
     * @return Current 6-digit code
     */
    public String generateCurrentCode(String secret) throws CodeGenerationException {
        return codeGenerator.generate(secret, timeProvider.getTime());
    }
}