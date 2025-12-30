package com.carportal.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для создания и редактирования автомобиля.
 * Содержит все необходимые поля для операций с автомобилями.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarRequestDTO {

    /** Марка автомобиля */
    private String brand;

    /** Модель автомобиля */
    private String model;

    /** Год выпуска */
    private int year;

    /** Цена автомобиля */
    private double price;

    /** Описание автомобиля */
    private String description;

    /** URL изображения автомобиля */
    private String imageUrl;

    /**
     * Статус доступности автомобиля.
     * Явное указание имени поля для JSON.
     */
    @JsonProperty("isAvailable")
    private Boolean isAvailable;
}