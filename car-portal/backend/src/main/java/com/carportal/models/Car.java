package com.carportal.models;

import com.carportal.models.enums.CarStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Сущность автомобиля.
 * Представляет автомобиль в каталоге портала.
 */
@Entity
@Table(name = "cars")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Car {

    /** Уникальный идентификатор автомобиля */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Марка автомобиля */
    @Column(nullable = false)
    private String brand;

    /** Модель автомобиля */
    @Column(nullable = false)
    private String model;

    /** Год выпуска */
    @Column(nullable = false)
    private int year;

    /** Цена автомобиля */
    @Column(nullable = false)
    private double price;

    /** Описание автомобиля */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** URL изображения автомобиля */
    private String imageUrl;

    /** Статус доступности автомобиля */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarStatus status = CarStatus.AVAILABLE;

    /** Продавец автомобиля */
    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;
}