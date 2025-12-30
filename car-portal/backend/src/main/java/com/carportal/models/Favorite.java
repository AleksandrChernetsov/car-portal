package com.carportal.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Сущность избранного автомобиля.
 * Представляет связь между пользователем и автомобилем в избранном.
 */
@Entity
@Table(name = "favorites")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Favorite {

    /** Уникальный идентификатор записи */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Пользователь, добавивший автомобиль в избранное */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Автомобиль, добавленный в избранное */
    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;
}