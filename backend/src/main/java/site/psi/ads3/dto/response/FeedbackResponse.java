package site.psi.ads3.dto.response;
import site.psi.ads3.entity.Feedback;

public record FeedbackResponse(
        Long id,
        String nome,
        Integer idade,
        String descricao
) {
    public static FeedbackResponse fromEntity(Feedback feedback) {
        return new FeedbackResponse(
                feedback.getId(),
                feedback.getNome(),
                feedback.getIdade(),
                feedback.getDescricao()
        );
    }
}