package com.carportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представления данных о пользователе для администратора.
 * Содержит дополнительные поля, доступные только администратору.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserResponseDTO {

    /** Идентификатор пользователя */
    private Long id;

    /** Имя пользователя */
    private String username;

    /** Пароль пользователя (захешированный) */
    private String password;

    /** Email пользователя */
    private String email;

    /** Роль пользователя */
    private String role;

    /** Телефон пользователя */
    private String phone;
}