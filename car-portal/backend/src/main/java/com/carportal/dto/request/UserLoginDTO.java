package com.carportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для входа пользователя в систему.
 * Содержит учетные данные для аутентификации.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {

    /** Имя пользователя */
    private String username;

    /** Пароль пользователя */
    private String password;
}