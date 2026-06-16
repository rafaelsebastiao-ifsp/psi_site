package site.psi.ads3.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import site.psi.ads3.entity.NewsArticle;
import site.psi.ads3.repository.NewsArticleRepository;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private static final Logger logger = LoggerFactory.getLogger(NewsService.class);

    private final RestTemplate restTemplate;
    private final NewsArticleRepository repo;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${newsapi.key}")
    private String newsApiKey;

    private static final int MAX_ARTICLES = 200;

    public NewsService(RestTemplate restTemplate, NewsArticleRepository repo) {
        this.restTemplate = restTemplate;
        this.repo = repo;
    }

    // Run daily at 03:00
    @Scheduled(cron = "0 0 3 * * *")
    public void scheduledFetch() {
        try {
            logger.info("Running scheduled news fetch...");
            fetchAndStore();
        } catch (Exception e) {
            logger.error("Error during scheduled fetch", e);
        }
    }

    public void fetchAndStore() {
        if (newsApiKey == null || newsApiKey.isBlank()) {
            logger.warn("newsapi.key not configured; skipping fetch");
            return;
        }

        // Build query for Portuguese + gambling-related terms
        String q = "apostas OR bets OR \"jogo compulsivo\" OR \"vício em apostas\" OR gambling";
        String url = String.format("https://newsapi.org/v2/everything?q=%s&language=pt&sortBy=publishedAt&pageSize=100&apiKey=%s",
                encode(q), newsApiKey);

        ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
            if (!resp.getStatusCode().is2xxSuccessful()) {
                logger.warn("NewsAPI responded with status {}", resp.getStatusCode().value());
                return;
            }

        try {
            JsonNode root = mapper.readTree(resp.getBody());
            JsonNode articles = root.path("articles");
            if (!articles.isArray()) return;

            List<NewsArticle> created = new ArrayList<>();

            for (JsonNode a : articles) {
                String articleUrl = a.path("url").asText(null);
                if (articleUrl == null || articleUrl.isBlank()) continue;

                Optional<NewsArticle> exist = repo.findByUrl(articleUrl);
                if (exist.isPresent()) continue; // skip duplicates

                NewsArticle na = new NewsArticle();
                na.setUrl(articleUrl);
                na.setTitle(a.path("title").asText(null));
                na.setDescription(a.path("description").asText(null));
                na.setImageUrl(a.path("urlToImage").asText(null));
                na.setSource(a.path("source").path("name").asText(null));

                String published = a.path("publishedAt").asText(null);
                if (published != null) {
                    try {
                        OffsetDateTime odt = OffsetDateTime.parse(published, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                        na.setPublishedAt(odt);
                    } catch (Exception ex) {
                        na.setPublishedAt(OffsetDateTime.now());
                    }
                } else {
                    na.setPublishedAt(OffsetDateTime.now());
                }

                na.setInsertedAt(OffsetDateTime.now());

                created.add(repo.save(na));
            }

            if (!created.isEmpty()) {
                logger.info("Saved {} new articles", created.size());
            } else {
                logger.info("No new articles found");
            }

            // Enforce cap of MAX_ARTICLES
            long total = repo.count();
            if (total > MAX_ARTICLES) {
                long toRemove = total - MAX_ARTICLES;
                Page<NewsArticle> oldest = repo.findAll(PageRequest.of(0, (int) toRemove, org.springframework.data.domain.Sort.by("publishedAt").ascending()));
                List<NewsArticle> remove = oldest.getContent();
                if (!remove.isEmpty()) {
                    repo.deleteAllInBatch(remove);
                    logger.info("Deleted {} old articles to enforce cap", remove.size());
                }
            }

        } catch (Exception e) {
            logger.error("Error parsing NewsAPI response", e);
        }
    }

    private static String encode(String s) {
        return s.replace(" ", "%20").replace("\"", "%22");
    }

    public Page<NewsArticle> search(String q, int page, int size) {
        Pageable p = PageRequest.of(page, size);
        if (q == null || q.isBlank()) {
            return repo.findAll(PageRequest.of(page, size).withSort(org.springframework.data.domain.Sort.by("publishedAt").descending()));
        }
        return repo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByPublishedAtDesc(q, q, p);
    }

}
