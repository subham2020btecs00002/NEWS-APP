package com.newsapp.auth.service;

import com.newsapp.auth.model.ChangePasswordRequest;
import com.newsapp.auth.model.UserCredential;
import com.newsapp.auth.repository.UserCredentialRepository;
import com.newsapp.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserCredentialRepository userCredentialRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserCredential registerUser(UserCredential userCredential) {
        userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));
        return userCredentialRepository.save(userCredential);
    }

    public String login(String email, String password) {
        UserCredential userCredential = userCredentialRepository.findByEmail(email).orElse(null);
        if (userCredential != null && passwordEncoder.matches(password, userCredential.getPassword())) {
            return jwtService.generateToken(email);
        }
        return null; // or throw an exception
    }

    // Correctly implement UserDetailsService method
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserCredential userCredential = userCredentialRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Return a Spring Security User object with authorities
        return new org.springframework.security.core.userdetails.User(
                userCredential.getEmail(),
                userCredential.getPassword(),
                new ArrayList<>() // Empty authorities, as roles are not required
        );
    }
    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        // Fetch user by email
        UserCredential user = userCredentialRepository.findByEmail(changePasswordRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        // Check if the old password matches
        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect!");
        }

        // Hash the new password and update the user record
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userCredentialRepository.save(user);
    }

    // Kafka consumer for user credentials
    @KafkaListener(topics = "user_credentials", groupId = "auth_group")
    public void consumeUserCredentials(String message) {
        String[] parts = message.split(",");
        UserCredential userCredential = new UserCredential();
        userCredential.setEmail(parts[0]);
        userCredential.setPassword(parts[1]); // Raw password; hash it before storing
        registerUser(userCredential); // Call registerUser method to hash and save
    }
}
