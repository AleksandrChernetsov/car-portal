package com.carportal.utils.security;

import com.carportal.exception.EntityNotFoundException;
import com.carportal.models.User;
import com.carportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Утилитный класс для работы с безопасностью.
 * Предоставляет методы для получения текущего пользователя и имени пользователя.
 */
@Component
public class UtilsSecurity {
    private static UserRepository userRepository;

    /**
     * Устанавливает репозиторий пользователей через внедрение зависимости.
     *
     * @param userRepository репозиторий пользователей
     */
    @Autowired
    public UtilsSecurity(UserRepository userRepository) {
        UtilsSecurity.userRepository = userRepository;
    }

    /**
     * Получает имя текущего аутентифицированного пользователя.
     *
     * @return имя пользователя
     */
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new EntityNotFoundException("Пользователь не найден!");
        }
        return authentication.getName();
    }

    /**
     * Получает текущего аутентифицированного пользователя.
     *
     * @return сущность пользователя
     */
    public User getCurrentUser() {
        String username = getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден: " + username));
    }
}