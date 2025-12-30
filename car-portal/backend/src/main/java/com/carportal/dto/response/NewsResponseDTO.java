package com.carportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представления данных о новости.
 * Используется для передачи информации о новостях клиенту.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsResponseDTO {

    /** Идентификатор новости */
    private Long id;

    /** Автор новости */
    private String author;

    /** Заголовок новости */
    private String title;

    /** Содержание новости */
    private String content;

    /** Дата публикации новости */
    private String date;
}