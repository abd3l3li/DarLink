package com.DarLink.DarLink.security;

import com.DarLink.DarLink.config.JwtConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    // Inject our config class so we can use the .env variables
    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    // 1. Convert your plain text secret key into a cryptographic key
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 2. Generate a new Token (The "ID Card")
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email) // The "name" on the ID card
                .issuedAt(new Date(System.currentTimeMillis())) // Issue date
                .expiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration())) // Expiry date
                .signWith(getSigningKey()) // The official cryptographic stamp
                .compact(); // Build the final String
    }

    // 3. Read a Token to find out whose it is
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Make sure nobody forged our stamp
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject(); // Extract the email
    }

    // 4. Verify if the token belongs to the user and isn't expired
    public boolean isTokenValid(String token, String userEmail) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(userEmail) && !isTokenExpired(token));
    }

    // 5. Check the expiration date
    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();

        return expiration.before(new Date());
    }
}