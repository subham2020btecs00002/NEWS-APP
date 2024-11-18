package com.example.wishlist.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "wishlists")
public class Article {
    @Id
    private String id;

    private Source source;
    private String author;
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private String publishedAt;
    private String content;

    private String userEmail; // Add this field to store the user's email

    // Nested class for source
    @Data
    public static class Source {
        private String id;
        private String name;
    }
}
