package site.psi.ads3.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import site.psi.ads3.entity.NewsArticle;

import java.util.Optional;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {

    Optional<NewsArticle> findByUrl(String url);

    Page<NewsArticle> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByPublishedAtDesc(
            String title, String description, Pageable pageable);

}
