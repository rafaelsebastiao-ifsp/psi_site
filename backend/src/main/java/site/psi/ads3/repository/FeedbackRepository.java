package site.psi.ads3.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.psi.ads3.entity.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {}