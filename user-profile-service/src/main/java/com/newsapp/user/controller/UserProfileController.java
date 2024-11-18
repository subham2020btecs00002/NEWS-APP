package com.newsapp.user.controller;

import com.newsapp.user.model.UserProfile;
import com.newsapp.user.service.UserProfileService;
import com.newsapp.user.kafka.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User-Profile-Service", description = "APIs for User Registration")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private KafkaProducer kafkaProducer;
    
    @Operation(summary = "Register a New User")
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserProfile userProfile, @RequestParam String password) {
        userProfileService.createUserProfile(userProfile);

        // Send credentials to Kafka
        kafkaProducer.sendCredentials(userProfile.getEmail(), password);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }
    @Operation(summary = "Get a user by his email")
    @GetMapping("/{email}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable String email) {
        UserProfile userProfile = userProfileService.getUserProfileByEmail(email);
        return userProfile != null ? ResponseEntity.ok(userProfile) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
