package com.carportal.utils.mapper;

import com.carportal.dto.request.UserCreateDTO;
import com.carportal.dto.request.UserEditDTO;
import com.carportal.dto.response.UserResponseDTO;
import com.carportal.models.User;
import com.carportal.models.enums.UserRole;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Маппер для преобразования между сущностью User и DTO.
 * Содержит методы для конвертации данных пользователей.
 */
@Component
public abstract class UserMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    /**
     * Преобразует UserCreateDTO в сущность User.
     *
     * @param userCreateDTO DTO с данными для создания пользователя
     * @return сущность User
     */
    public static User userCreateDtoToUser(UserCreateDTO userCreateDTO) {
        User user = new User();
        user.setUsername(userCreateDTO.getUsername());
        user.setEmail(userCreateDTO.getEmail());
        user.setRole(UserRole.USER);
        user.setPhone(userCreateDTO.getPhone());
        return user;
    }

    /**
     * Преобразует сущность User в UserResponseDTO.
     *
     * @param user сущность пользователя
     * @return DTO с данными пользователя
     */
    public static UserResponseDTO userToUserResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setAvatar(user.getAvatar());
        dto.setPhone(user.getPhone());
        dto.setVisitCount(user.getVisitCount());

        if (user.getCreatedAt() != null) {
            dto.setCreatedAt(user.getCreatedAt().format(DATE_FORMATTER));
        } else {
            dto.setCreatedAt("Неизвестно");
        }

        if (user.getLastLoginAt() != null) {
            dto.setLastLoginAt(user.getLastLoginAt().format(DATE_FORMATTER));
        } else {
            dto.setLastLoginAt("Никогда");
        }

        return dto;
    }

    /**
     * Преобразует UserEditDTO в сущность User.
     *
     * @param userEditDTO DTO с обновленными данными пользователя
     * @param existingUser существующий пользователь
     * @return обновленная сущность User
     */
    public static User userEditDTOToUser(UserEditDTO userEditDTO, User existingUser) {
        if (userEditDTO.getUsername() != null && !userEditDTO.getUsername().isEmpty()) {
            existingUser.setUsername(userEditDTO.getUsername());
        }
        if (userEditDTO.getEmail() != null && !userEditDTO.getEmail().isEmpty()) {
            existingUser.setEmail(userEditDTO.getEmail());
        }
        if (userEditDTO.getPhone() != null && !userEditDTO.getPhone().isEmpty()) {
            existingUser.setPhone(userEditDTO.getPhone());
        }
        return existingUser;
    }

    /**
     * Преобразует список сущностей User в список UserResponseDTO.
     *
     * @param users список сущностей пользователей
     * @return список DTO с данными пользователей
     */
    public static List<UserResponseDTO> usersToUserResponseDTOs(List<User> users) {
        return users.stream()
                .map(UserMapper::userToUserResponseDTO)
                .collect(Collectors.toList());
    }
}