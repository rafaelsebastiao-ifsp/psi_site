package site.psi.ads3.service;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import site.psi.ads3.dto.request.UserRequest;
import site.psi.ads3.dto.response.UserResponse;
import site.psi.ads3.entity.User;
import site.psi.ads3.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public UserResponse create(UserRequest request) {
        User user = new User();
        user.setLogin(request.login());
        user.setPasswordHash(encoder.encode(request.password()));
        user.setRole("ADMIN");
        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User não encontrado"));
        return UserResponse.fromEntity(user);
    }
}