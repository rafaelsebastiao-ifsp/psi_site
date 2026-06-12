package site.psi.ads3.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import site.psi.ads3.entity.User;
import site.psi.ads3.repository.UserRepository;
import site.psi.ads3.security.JWTService;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JWTService jwtService;

    public String login(String login, String password) {
        User user = userRepository.findByLogin(login);
        if (user == null) throw new RuntimeException("Usuário não encontrado");
        if (!encoder.matches(password, user.getPasswordHash())) throw new RuntimeException("Senha inválida");
        return jwtService.generateToken(user.getId(), user.getLogin());
    }
}