package com.DarLink.Darlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv; // Import this

@SpringBootApplication
public class DarlinkApplication {

    public static void main(String[] args) {
        // 1. Load .env file
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        
        
        // 2. Set them as System Properties so Spring can see them
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        // 3. Start Spring Boot
        SpringApplication.run(DarlinkApplication.class, args);
    }
}
