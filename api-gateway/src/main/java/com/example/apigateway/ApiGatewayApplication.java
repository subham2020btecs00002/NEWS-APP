package com.example.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import com.example.apigateway.filter.JwtAuthenticationFilter;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder, JwtAuthenticationFilter jwtAuthenticationFilter) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/v1/users/register")
                        .uri("lb://USER-PROFILE-SERVICE"))  // Change this URI if needed
            .route("user-service", r -> r.path("/api/v1/users/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://USER-PROFILE-SERVICE"))
            .route("wishlist-service", r -> r.path("/api/wishlist/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("http://localhost:8090"))
            .route("news-service", r -> r.path("/search")
                    .uri("lb://NEWS-SERVICE"))
            .route("authentication-service", r -> r.path("/auth/**")
                    .uri("lb://AUTHENTICATION-SERVICE"))

            .build();
    }
}
