package com.newsapp.auth.controller;

import com.newsapp.auth.model.AuthRequest;
import com.newsapp.auth.service.AuthService;
import com.newsapp.auth.security.JwtService;
import com.newsapp.auth.model.ChangePasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Serivce", description = "Login and Generate Bearer Token")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome! This endpoint is not secure.";
    }

    // API to generate token after login
    @Operation(summary = "Generate a Bearer Token")
    @PostMapping("/generateToken")
    public ResponseEntity<String> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(authRequest.getUsername());
            return ResponseEntity.ok(token);
        } else {
            throw new UsernameNotFoundException("Invalid username or password!");
        }
    }

    // A protected endpoint example (accessible only with JWT token)
    @Operation(summary = "Accessing User Profile after adding Bearer Token")
    @GetMapping("/userProfile")
    public ResponseEntity<String> userProfile() {
        return new ResponseEntity<>("Welcome to the User Profile!", HttpStatus.OK);
    }
    
    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            authService.changePassword(changePasswordRequest);
            return ResponseEntity.ok("Password changed successfully!");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("User not found!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
