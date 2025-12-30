package com.carportal.models;

import com.carportal.models.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Сущность пользователя.
 * Представляет пользователя автомобильного портала.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    /** Уникальный идентификатор пользователя */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Имя пользователя (логин) */
    @Column(unique = true, nullable = false)
    private String username;

    /** Пароль пользователя */
    @Column(nullable = false)
    private String password;

    /** Email пользователя */
    @Column(nullable = false)
    private String email;

    /** Роль пользователя */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    /** URL аватара пользователя */
    private String avatar;

    /** Телефон пользователя */
    private String phone;

    /** Дата создания пользователя */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Дата последнего входа */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    /** Количество посещений пользователя */
    @Column(name = "visit_count", nullable = false, columnDefinition = "int default 0")
    private int visitCount = 0;

    /** Список автомобилей в избранном */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Favorite> favorites = new HashSet<>();

    /** Автомобили, добавленные пользователем */
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Car> cars = new HashSet<>();

    /**
     * Устанавливает дату создания и аватар по умолчанию перед сохранением.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (avatar == null) {
            avatar = "http://localhost:8080/images/userImages/defaultUserImage.jpg";
        }
    }
}