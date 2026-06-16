package site.psi.ads3.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import site.psi.ads3.entity.NewsArticle;
import site.psi.ads3.service.NewsService;

import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public Page<NewsArticle> list(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "12") int size
    ) {
        return newsService.search(query, page, size);
    }

    // Simple trigger endpoint (admin) to force a fetch (could be secured later)
    @GetMapping("/fetch-now")
    public Map<String, String> fetchNow() {
        newsService.fetchAndStore();
        return Map.of("status", "ok");
    }

}
