package com.newsapp.user.service;

import com.newsapp.user.exception.EmailAlreadyExistsException;
import com.newsapp.user.model.UserProfile;
import com.newsapp.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfile createUserProfile(UserProfile userProfile) {
        // Check for existing email
        if (userProfileRepository.findByEmail(userProfile.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email already exists: " + userProfile.getEmail());
        }
        return userProfileRepository.save(userProfile);
    }

    public UserProfile getUserProfileByEmail(String email) {
        return userProfileRepository.findByEmail(email);
    }
}
