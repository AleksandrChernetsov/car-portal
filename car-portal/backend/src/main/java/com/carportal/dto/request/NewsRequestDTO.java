package com.carportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для создания и редактирования новости.
 * Содержит поля для заголовка и содержания новости.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsRequestDTO {

    /** Заголовок новости */
    private String title;

    /** Содержание новости */
    private String content;
}