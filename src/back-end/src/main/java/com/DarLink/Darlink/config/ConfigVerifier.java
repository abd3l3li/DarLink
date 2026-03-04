package com.DarLink.Darlink.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class ConfigVerifier implements CommandLineRunner {

    private final JwtConfig jwtConfig;
    private final Environment environment;

    // Constructor Injection (No Lombok)
    public ConfigVerifier(JwtConfig jwtConfig, Environment environment) {
        this.jwtConfig = jwtConfig;
        this.environment = environment;
    }

    @Override
    public void run(String... args) {
        System.out.println("\n=======================================================");
        System.out.println("🔍 CONFIGURATION CHECK");
        System.out.println("=======================================================");
        
        // 1. Check values bound to your JwtConfig class
        System.out.println("✅ JWT Secret (from Class): " + jwtConfig.getSecret());
        System.out.println("✅ JWT Expiration (from Class): " + jwtConfig.getExpiration());
        
        // 2. Check a standard Spring property (resolved from your .env -> application.properties)
        System.out.println("✅ DB URL (from Env): " + environment.getProperty("spring.datasource.url"));
        
        System.out.println("=======================================================\n");
    }
}