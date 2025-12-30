package com.carportal.services;

import com.carportal.dto.request.UserCreateDTO;
import com.carportal.dto.request.UserEditDTO;
import com.carportal.dto.request.UserLoginDTO;
import com.carportal.dto.response.UserResponseDTO;
import com.carportal.exception.EntityAlreadyExistsException;
import com.carportal.exception.EntityNotFoundException;
import com.carportal.models.User;
import com.carportal.repository.UserRepository;
import com.carportal.utils.mapper.UserMapper;
import com.carportal.utils.security.UtilsSecurity;
import com.carportal.utils.validation.UserParamsValidator;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Сервис для операций с пользователями.
 * Обрабатывает логику регистрации, входа, редактирования профиля.
 */
@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UtilsSecurity utilsSecurity;

    /**
     * Регистрирует нового пользователя.
     *
     * @param userCreateDTO данные для регистрации
     * @return зарегистрированный пользователь в формате UserResponseDTO
     */
    public UserResponseDTO signup(UserCreateDTO userCreateDTO) {
        UserParamsValidator.userParamsValidate(userCreateDTO);

        if (userRepository.findByUsername(userCreateDTO.getUsername()).isPresent()) {
            throw new EntityAlreadyExistsException("Пользователь с таким именем уже существует!");
        }

        if (userRepository.findByEmail(userCreateDTO.getEmail()).isPresent()) {
            throw new EntityAlreadyExistsException("Пользователь с таким email уже существует!");
        }

        if (userCreateDTO.getPhone() != null &&
                !userCreateDTO.getPhone().trim().isEmpty() &&
                userRepository.findAll().stream()
                        .anyMatch(u -> userCreateDTO.getPhone().equals(u.getPhone()))) {
            throw new EntityAlreadyExistsException("Пользователь с таким телефоном уже существует!");
        }

        User user = UserMapper.userCreateDtoToUser(userCreateDTO);
        String encodedPassword = passwordEncoder.encode(userCreateDTO.getPassword());
        user.setPassword(encodedPassword);
        user.setAvatar("http://localhost:8080/images/userImages/defaultUserImage.jpg");

        User savedUser = userRepository.save(user);
        return UserMapper.userToUserResponseDTO(savedUser);
    }

    /**
     * Выполняет вход пользователя в систему.
     *
     * @param userLoginDTO данные для входа
     * @param session HTTP сессия
     * @return авторизованный пользователь в формате UserResponseDTO
     */
    public UserResponseDTO login(UserLoginDTO userLoginDTO, HttpSession session) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userLoginDTO.getUsername(),
                            userLoginDTO.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            User user = userRepository.findByUsername(userLoginDTO.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден!"));

            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            return UserMapper.userToUserResponseDTO(user);

        } catch (BadCredentialsException e) {
            if (!userRepository.findByUsername(userLoginDTO.getUsername()).isPresent()) {
                throw new EntityNotFoundException("Пользователь с именем '" + userLoginDTO.getUsername() + "' не найден");
            } else {
                throw new BadCredentialsException("Неверный пароль");
            }
        }
    }

    /**
     * Проверяет статус авторизации текущего пользователя.
     *
     * @return данные текущего пользователя, если авторизован
     */
    public UserResponseDTO checkLogin() {
        return UserMapper.userToUserResponseDTO(utilsSecurity.getCurrentUser());
    }

    /**
     * Выполняет выход пользователя из системы.
     *
     * @param session HTTP сессия
     */
    public void logout(HttpSession session) {
        SecurityContextHolder.clearContext();
        if (session != null) {
            session.invalidate();
        }
    }

    /**
     * Редактирует данные профиля пользователя.
     *
     * @param userEditDTO обновленные данные профиля
     * @return обновленные данные пользователя
     */
    public UserResponseDTO editProfile(UserEditDTO userEditDTO) {
        User user = utilsSecurity.getCurrentUser();
        if (!Objects.equals(user.getId(), userEditDTO.getId())) {
            throw new EntityNotFoundException("Ошибка поиска пользователя");
        }
        boolean isUpdated = false;

        if (userEditDTO.getUsername() != null && !userEditDTO.getUsername().isEmpty() &&
                !user.getUsername().equals(userEditDTO.getUsername())) {
            if (userRepository.findByUsername(userEditDTO.getUsername()).isPresent()) {
                throw new EntityAlreadyExistsException("Пользователь с таким именем уже существует!");
            }
            UserParamsValidator.usernameValidate(userEditDTO.getUsername());
            user.setUsername(userEditDTO.getUsername());
            isUpdated = true;
        }

        if (userEditDTO.getPassword() != null && !userEditDTO.getPassword().isEmpty() &&
                !passwordEncoder.matches(userEditDTO.getPassword(), user.getPassword())) {
            UserParamsValidator.passwordValidate(userEditDTO.getPassword());
            user.setPassword(passwordEncoder.encode(userEditDTO.getPassword()));
            isUpdated = true;
        }

        if (userEditDTO.getEmail() != null && !userEditDTO.getEmail().isEmpty() &&
                !user.getEmail().equals(userEditDTO.getEmail())) {
            if (userRepository.findByEmail(userEditDTO.getEmail()).isPresent()) {
                throw new EntityAlreadyExistsException("Пользователь с таким email уже существует!");
            }
            UserParamsValidator.emailValidate(userEditDTO.getEmail());
            user.setEmail(userEditDTO.getEmail());
            isUpdated = true;
        }

        if (userEditDTO.getPhone() != null && !userEditDTO.getPhone().equals(user.getPhone())) {
            if (userEditDTO.getPhone() != null && !userEditDTO.getPhone().trim().isEmpty()) {
                if (userRepository.findAll().stream()
                        .anyMatch(u -> userEditDTO.getPhone().equals(u.getPhone()) && !u.getId().equals(user.getId()))) {
                    throw new EntityAlreadyExistsException("Пользователь с таким телефоном уже существует!");
                }
                UserParamsValidator.phoneValidate(userEditDTO.getPhone());
                user.setPhone(userEditDTO.getPhone());
            } else {
                user.setPhone(null);
            }
            isUpdated = true;
        }

        if (isUpdated) {
            User updatedUser = userRepository.save(user);
            updateAuthenticationContext(updatedUser);
            return UserMapper.userToUserResponseDTO(updatedUser);
        }

        return UserMapper.userToUserResponseDTO(user);
    }

    /**
     * Загружает новый аватар пользователя.
     *
     * @param file файл изображения аватара
     * @return URL загруженного аватара
     */
    @Transactional
    public String uploadAvatar(MultipartFile file) {
        User user = utilsSecurity.getCurrentUser();
        log.info("Загрузка аватара для пользователя: {}", user.getUsername());

        try {
            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/userImages/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String oldAvatar = user.getAvatar();
            if (oldAvatar != null && !oldAvatar.contains("defaultUserImage")) {
                try {
                    String oldFileName = oldAvatar.substring(oldAvatar.lastIndexOf("/") + 1);
                    Path oldFilePath = uploadPath.resolve(oldFileName);
                    if (Files.exists(oldFilePath)) {
                        Files.delete(oldFilePath);
                        log.info("Старый аватар удален: {}", oldFileName);
                    }
                } catch (Exception e) {
                    log.warn("Не удалось удалить старый аватар: {}", e.getMessage());
                }
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String fileName = user.getUsername() + "_" + timestamp + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            String avatarUrl = "http://localhost:8080/images/userImages/" + fileName;
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            log.info("Новый аватар сохранен: {}", fileName);
            return avatarUrl;

        } catch (Exception e) {
            log.error("Ошибка при загрузке аватара: {}", e.getMessage());
            throw new RuntimeException("Ошибка при загрузке аватара: " + e.getMessage());
        }
    }

    /**
     * Удаляет текущий аватар пользователя и устанавливает аватар по умолчанию.
     *
     * @return URL аватара по умолчанию
     */
    @Transactional
    public String deleteAvatar() {
        User user = utilsSecurity.getCurrentUser();
        log.info("Удаление аватара для пользователя: {}", user.getUsername());

        try {
            String currentAvatar = user.getAvatar();

            if (currentAvatar != null && !currentAvatar.contains("defaultUserImage")) {
                try {
                    String fileName = currentAvatar.substring(currentAvatar.lastIndexOf("/") + 1);
                    String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/userImages/";
                    Path filePath = Paths.get(uploadDir, fileName);

                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                        log.info("Файл аватара удален: {}", fileName);
                    }
                } catch (Exception e) {
                    log.warn("Не удалось удалить файл аватара: {}", e.getMessage());
                }
            }

            String defaultAvatarUrl = "http://localhost:8080/images/userImages/defaultUserImage.jpg";
            user.setAvatar(defaultAvatarUrl);
            userRepository.save(user);

            log.info("Аватар успешно сброшен к дефолтному");
            return defaultAvatarUrl;

        } catch (Exception e) {
            log.error("Ошибка при удалении аватара: {}", e.getMessage());
            throw new RuntimeException("Ошибка при удалении аватара: " + e.getMessage());
        }
    }

    /**
     * Обновляет контекст аутентификации.
     *
     * @param updatedUser обновленный пользователь
     */
    private void updateAuthenticationContext(User updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            org.springframework.security.core.userdetails.User userDetails =
                    new org.springframework.security.core.userdetails.User(
                            updatedUser.getUsername(),
                            updatedUser.getPassword(),
                            auth.getAuthorities()
                    );
            UsernamePasswordAuthenticationToken newAuth =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            auth.getCredentials(),
                            userDetails.getAuthorities()
                    );
            newAuth.setDetails(auth.getDetails());
            SecurityContextHolder.getContext().setAuthentication(newAuth);
        }
    }
}