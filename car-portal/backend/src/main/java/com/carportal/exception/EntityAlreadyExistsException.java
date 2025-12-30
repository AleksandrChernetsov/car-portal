package com.carportal.exception;

import org.springframework.http.HttpStatus;

/**
 * Исключение, возникающее при попытке создать сущность, которая уже существует.
 * Например, при попытке зарегистрировать пользователя с существующим именем.
 */
public class EntityAlreadyExistsException extends AppException {

    /**
     * Конструктор исключения с информацией о сущности.
     *
     * @param entityName имя сущности
     * @param field имя поля
     * @param value значение поля
     */
    public EntityAlreadyExistsException(String entityName, String field, String value) {
        super(String.format("%s с %s '%s' уже существует", entityName, field, value), HttpStatus.CONFLICT);
    }

    /**
     * Конструктор исключения с пользовательским сообщением.
     *
     * @param message сообщение об ошибке
     */
    public EntityAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}