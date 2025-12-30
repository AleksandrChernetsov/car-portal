package com.carportal.exception;

import org.springframework.http.HttpStatus;

/**
 * Исключение, возникающее при неудачной валидации данных.
 * Например, при неверном формате email или недостаточной длине пароля.
 */
public class ValidateException extends AppException {

    /**
     * Конструктор исключения с сообщением об ошибке валидации.
     *
     * @param message сообщение об ошибке
     */
    public ValidateException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}