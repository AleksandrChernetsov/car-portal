package com.carportal.controllers;

import com.carportal.dto.request.UserCreateDTO;
import com.carportal.dto.request.UserEditDTO;
import com.carportal.dto.request.UserLoginDTO;
import com.carportal.dto.response.UserResponseDTO;
import com.carportal.services.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Контроллер для операций с пользователями.
 * Обрабатывает запросы, связанные с регистрацией, входом, редактированием профиля.
 */
@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Регистрирует нового пользователя.
     *
     * @param userCreateDTO данные для регистрации
     * @return зарегистрированный пользователь в формате UserResponseDTO
     */
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody UserCreateDTO userCreateDTO) {
        UserResponseDTO user = userService.signup(userCreateDTO);
        return ResponseEntity.ok(user);
    }

    /**
     * Выполняет вход пользователя в систему.
     *
     * @param userLoginDTO данные для входа
     * @param session HTTP сессия
     * @return авторизованный пользователь в формате UserResponseDTO
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserLoginDTO userLoginDTO, HttpSession session) {
        try {
            UserResponseDTO user = userService.login(userLoginDTO, session);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Проверяет статус авторизации текущего пользователя.
     *
     * @return данные текущего пользователя, если авторизован
     */
    @GetMapping("/checklogin")
    public ResponseEntity<UserResponseDTO> checkLogin() {
        try {
            UserResponseDTO user = userService.checkLogin();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Редактирует данные профиля пользователя.
     *
     * @param userEditDTO обновленные данные профиля
     * @return обновленные данные пользователя
     */
    @PostMapping("/edit")
    public ResponseEntity<UserResponseDTO> editProfile(@RequestBody UserEditDTO userEditDTO) {
        UserResponseDTO updatedUser = userService.editProfile(userEditDTO);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Выполняет выход пользователя из системы.
     *
     * @param session HTTP сессия
     * @return сообщение об успешном выходе
     */
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        userService.logout(session);
        return ResponseEntity.ok("Вы успешно вышли из системы");
    }

    /**
     * Загружает новый аватар пользователя.
     *
     * @param file файл изображения аватара
     * @return URL загруженного аватара
     */
    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(file);
        return ResponseEntity.ok(avatarUrl);
    }

    /**
     * Удаляет текущий аватар пользователя и устанавливает аватар по умолчанию.
     *
     * @return URL аватара по умолчанию
     */
    @DeleteMapping("/avatar")
    public ResponseEntity<String> deleteAvatar() {
        String defaultAvatarUrl = userService.deleteAvatar();
        return ResponseEntity.ok(defaultAvatarUrl);
    }
}