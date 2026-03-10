package com.DarLink.DarLink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv; // Import this

@SpringBootApplication
public class DarLinkApplication {

    public static void main(String[] args) {

        // 3. Start Spring Boot
        SpringApplication.run(DarLinkApplication.class, args);
    }
}
