package com.carportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для редактирования профиля пользователя.
 * Содержит поля, которые может изменить пользователь в своем профиле.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEditDTO {

    /** Идентификатор пользователя */
    private Long id;

    /** Имя пользователя */
    private String username;

    /** Пароль пользователя */
    private String password;

    /** Email пользователя */
    private String email;

    /** Телефон пользователя */
    private String phone;
}