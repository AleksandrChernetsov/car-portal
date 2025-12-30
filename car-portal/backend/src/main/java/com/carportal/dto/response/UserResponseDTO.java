package com.carportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представления данных о пользователе.
 * Используется для передачи информации о пользователях клиенту.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    /** Идентификатор пользователя */
    private Long id;

    /** Имя пользователя */
    private String username;

    /** Email пользователя */
    private String email;

    /** Роль пользователя */
    private String role;

    /** URL аватара пользователя */
    private String avatar;

    /** Телефон пользователя */
    private String phone;

    /** Дата создания пользователя */
    private String createdAt;

    /** Дата последнего входа */
    private String lastLoginAt;

    /** Количество посещений */
    private int visitCount;
}