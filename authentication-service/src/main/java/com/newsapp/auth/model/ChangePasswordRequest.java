package com.newsapp.auth.model;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String email; // Assuming email is used for user identification
    private String oldPassword;
    private String newPassword;
}
