package com.example.wishlist.controller;
import com.example.wishlist.dto.MessageResponse; // Import the new DTO

import com.example.wishlist.model.Article;
import com.example.wishlist.service.ArticleService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist-Service", description = "APIs for adding news to wishlist")

public class ArticleController {

    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class); // Declare logger

    @Autowired
    private ArticleService articleService;

    @Value("${jwt.secret}")  // JWT secret from application.properties
    private String jwtSecret;

    @Operation(summary = "Adding news to wishlist")
    @PostMapping
    public ResponseEntity<?> saveArticle(@RequestBody Article article, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        // Check if the token starts with "Bearer " and extract the actual token
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7); // Remove "Bearer " prefix

            // Decode the JWT token to get the user's email
            String userEmail = getEmailFromToken(jwtToken);
            article.setUserEmail(userEmail); // Associate the article with the user's email
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // Token is missing or invalid
        }

        // Check if the article already exists for the user
        Optional<Article> existingArticle = articleService.getArticleByUrlAndUserEmail(article.getUrl(), article.getUserEmail());
        if (existingArticle.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Article already exists in your wishlist.");  // Article already exists for this user
        }

        try {
            Article savedArticle = articleService.saveArticle(article);
            return ResponseEntity.ok(savedArticle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());  // Handle other potential conflicts
        }
    }

    // Get all articles for the authenticated user
    @Operation(summary = "Add a news for a particular")
    @GetMapping
    public ResponseEntity<List<Article>> getUserArticles(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
        	String jwtToken = token.substring(7);
            String userEmail = getEmailFromToken(jwtToken);
            logger.info("Fetching articles for user: {}", userEmail);
            List<Article> articles = articleService.getUserArticles(userEmail);
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            logger.error("Error fetching articles for user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get article by ID
    @Operation(summary = "Add a particular news by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable String id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete article by ID
    @Operation(summary = "Delete a particular news by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    // Search articles by title for the authenticated user
    @Operation(summary = "Search news for a Particular User (email)")
    @GetMapping("/search")
    public ResponseEntity<List<Article>> searchArticles(@RequestParam String keyword, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
    	String jwtToken = token.substring(7);
    	String userEmail = getEmailFromToken(jwtToken);
    	logger.info(userEmail);
        List<Article> articles = articleService.searchArticles(keyword, userEmail);
        return ResponseEntity.ok(articles);
    }

    // Decode the JWT token and extract the user's email
    private String getEmailFromToken(String token) {
        byte[] decodedSecret = Base64.getDecoder().decode(jwtSecret);
        SecretKey key = Keys.hmacShaKeyFor(decodedSecret);
        
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (io.jsonwebtoken.io.DecodingException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT token");
        }
    }
    // Get all articles for a specific user by email
    @Operation(summary = "Get all articles for a specific user by email")
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getArticlesByUserEmail(@PathVariable String email) {
        logger.info("Fetching articles for user: {}", email);
        List<Article> articles = articleService.getUserArticles(email);
        
        if (articles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No articles found in wishlist for this user."));
        }
        
        return ResponseEntity.ok(articles);
    }

}
