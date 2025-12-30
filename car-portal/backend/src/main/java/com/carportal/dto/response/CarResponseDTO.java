package com.carportal.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представления данных об автомобиле.
 * Используется для передачи информации об автомобилях клиенту.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarResponseDTO {

    /** Идентификатор автомобиля */
    private Long id;

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
    private boolean isAvailable;

    /** Идентификатор продавца */
    private Long sellerId;

    /** Имя продавца */
    private String sellerName;
}