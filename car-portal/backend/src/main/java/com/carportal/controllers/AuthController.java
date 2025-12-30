package com.carportal.controllers;

import com.carportal.dto.request.UserCreateDTO;
import com.carportal.dto.request.UserLoginDTO;
import com.carportal.dto.response.UserResponseDTO;
import com.carportal.services.UserService;
import com.carportal.utils.validation.UserParamsValidator;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Контроллер для операций аутентификации.
 * Обрабатывает запросы, связанные с регистрацией и входом пользователей в систему.
 */
@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Регистрирует нового пользователя в системе.
     *
     * @param userCreateDTO данные для регистрации нового пользователя
     * @return зарегистрированный пользователь в формате UserResponseDTO
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserCreateDTO userCreateDTO) {
        UserParamsValidator.userParamsValidate(userCreateDTO);

        if (userCreateDTO.getPhone() != null && userCreateDTO.getPhone().trim().isEmpty()) {
            userCreateDTO.setPhone(null);
        }

        UserResponseDTO registeredUser = userService.signup(userCreateDTO);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * Аутентифицирует пользователя в системе.
     *
     * @param userLoginDTO данные для входа в систему
     * @param session HTTP сессия для хранения состояния аутентификации
     * @return аутентифицированный пользователь в формате UserResponseDTO
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserLoginDTO userLoginDTO, HttpSession session) {
        try {
            UserResponseDTO authenticatedUser = userService.login(userLoginDTO, session);
            return ResponseEntity.ok(authenticatedUser);
        } catch (Exception e) {
            throw e;
        }
    }
}