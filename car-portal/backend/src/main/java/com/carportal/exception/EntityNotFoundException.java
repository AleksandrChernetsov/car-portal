package com.carportal.exception;

import org.springframework.http.HttpStatus;

/**
 * Исключение, возникающее при попытке найти несуществующую сущность.
 * Например, при попытке найти пользователя по несуществующему ID.
 */
public class EntityNotFoundException extends AppException {

    /**
     * Конструктор исключения с информацией о сущности.
     *
     * @param entityName имя сущности
     * @param id идентификатор сущности
     */
    public EntityNotFoundException(String entityName, Long id) {
        super(String.format("%s с ID %d не найден", entityName, id), HttpStatus.NOT_FOUND);
    }

    /**
     * Конструктор исключения с пользовательским сообщением.
     *
     * @param message сообщение об ошибке
     */
    public EntityNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}