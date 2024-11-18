package com.newsapp.user.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_profiles")
@Data  // Lombok will generate getters, setters, etc.
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)  // Ensure email is unique and not null
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
}
