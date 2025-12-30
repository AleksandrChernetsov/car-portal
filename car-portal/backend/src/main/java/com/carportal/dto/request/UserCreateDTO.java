package com.carportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO для создания нового пользователя.
 * Используется при регистрации нового пользователя в системе.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateDTO {

    /** Имя пользователя */
    private String username;

    /** Email пользователя */
    private String email;

    /** Пароль пользователя */
    private String password;

    /** Телефон пользователя */
    private String phone;
}