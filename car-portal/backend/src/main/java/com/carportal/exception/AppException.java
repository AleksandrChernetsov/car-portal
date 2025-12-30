package com.carportal.exception;

import org.springframework.http.HttpStatus;

/**
 * Абстрактный класс для всех прикладных исключений.
 * Содержит HTTP статус для обработки исключений.
 */
public abstract class AppException extends RuntimeException {
    private final HttpStatus httpStatus;

    /**
     * Конструктор исключения с сообщением и HTTP статусом.
     *
     * @param message сообщение об ошибке
     * @param httpStatus HTTP статус для ответа
     */
    public AppException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    /**
     * Получает HTTP статус исключения.
     *
     * @return HTTP статус
     */
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}