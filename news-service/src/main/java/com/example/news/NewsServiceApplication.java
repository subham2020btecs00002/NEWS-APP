package com.example.news;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class NewsServiceApplication {

    public static void main(String[] args) {
        try {
            // Disable SSL verification globally
            DisableSSLVerification.disableSSLVerification();
        } catch (Exception e) {
            System.err.println("Failed to disable SSL verification: " + e.getMessage());
        }

        // Start the Spring Boot application
        SpringApplication.run(NewsServiceApplication.class, args);
    }
}
