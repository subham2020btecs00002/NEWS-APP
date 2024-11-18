package com.example.news.controller;

import com.example.news.service.NewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;


@RestController
@Tag(name = "News-Service", description = "APIs for searching news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }
    @Operation(summary = "Get news with pagination")
    @GetMapping("/search")
    public String searchNews(@RequestParam String query, 
                             @RequestParam(defaultValue = "1") int page, 
                             @RequestParam(defaultValue = "5") int pageSize) {
        return newsService.fetchNews(query, page, pageSize);
    }
}
