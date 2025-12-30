package com.carportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для редактирования данных пользователя администратором.
 * Содержит поля, которые могут быть изменены администратором.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserEditDTO {

    /** Идентификатор пользователя */
    private Long id;

    /** Имя пользователя */
    private String username;

    /** Пароль пользователя */
    private String password;

    /** Email пользователя */
    private String email;

    /** Роль пользователя */
    private String role;

    /** Телефон пользователя */
    private String phone;
}