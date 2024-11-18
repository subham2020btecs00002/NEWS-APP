package com.example.wishlist.repository;

import com.example.wishlist.model.Article;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends MongoRepository<Article, String> {
    // Find all articles for a specific user
    List<Article> findByUserEmail(String userEmail);
    
    // Check if an article with the same URL exists for a specific user
    Optional<Article> findByUrlAndUserEmail(String url, String userEmail);

    // Search articles by title containing a keyword for a specific user
    List<Article> findByUserEmailAndDescriptionContainingOrUserEmailAndContentContaining(String userEmail1, String descriptionKeyword, String userEmail2, String contentKeyword);
    
    
}
