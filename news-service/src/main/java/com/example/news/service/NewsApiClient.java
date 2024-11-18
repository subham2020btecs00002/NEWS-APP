package com.example.news.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "news-api", url = "${news.api.url}")
public interface NewsApiClient {

    @GetMapping
    String getNews(@RequestParam("q") String query,
                   @RequestParam("apiKey") String apiKey,
                   @RequestParam("page") int page,
                   @RequestParam("pageSize") int pageSize);
}
