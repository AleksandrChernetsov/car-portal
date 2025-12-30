package com.carportal.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Сущность новости.
 * Представляет новость на автомобильном портале.
 */
@Entity
@Table(name = "news")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class News {

    /** Уникальный идентификатор новости */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Автор новости */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Заголовок новости */
    @Column(nullable = false)
    private String title;

    /** Содержание новости */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** Дата публикации новости */
    @Column(nullable = false)
    private LocalDate date;
}