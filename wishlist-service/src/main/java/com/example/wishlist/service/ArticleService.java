package com.example.wishlist.service;

import com.example.wishlist.model.Article;
import com.example.wishlist.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    // Save article only if it does not already exist for the user
    public Article saveArticle(Article article) {
        Optional<Article> existingArticle = articleRepository.findByUrlAndUserEmail(article.getUrl(), article.getUserEmail());
        if (existingArticle.isPresent()) {
            throw new IllegalArgumentException("Article already exists in the wishlist for this user.");
        }
        return articleRepository.save(article);
    }

    // Get all articles for a specific user
    public List<Article> getUserArticles(String userEmail) {
        return articleRepository.findByUserEmail(userEmail);
    }

    // Get article by ID
    public Optional<Article> getArticleById(String id) {
        return articleRepository.findById(id);
    }

    // Delete article by ID
    public void deleteArticle(String id) {
        articleRepository.deleteById(id);
    }
    public Optional<Article> getArticleByUrlAndUserEmail(String url, String userEmail) {
        return articleRepository.findByUrlAndUserEmail(url, userEmail);
    }

    // Search articles by title for a specific user
    public List<Article> searchArticles(String keyword, String userEmail) {
        return articleRepository.findByUserEmailAndDescriptionContainingOrUserEmailAndContentContaining(userEmail, keyword, userEmail, keyword);
    }
}
