package com.example.news.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NewsService {

    private final NewsApiClient newsApiClient;
    
    @Value("${news.api.key}")
    private String apiKey;

    public NewsService(NewsApiClient newsApiClient) {
        this.newsApiClient = newsApiClient;
    }

    public String fetchNews(String keyword, int page, int pageSize) {
        return newsApiClient.getNews(keyword, apiKey, page, pageSize);
    }
    
}
