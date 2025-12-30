package com.carportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представления ошибок.
 * Используется для стандартизированного формата ответов об ошибках.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /** Тип ошибки */
    private String error;

    /** Сообщение об ошибке */
    private String message;
}