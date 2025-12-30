package com.carportal.repository;

import com.carportal.models.Car;
import com.carportal.models.Favorite;
import com.carportal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для работы с избранными автомобилями.
 * Предоставляет методы для взаимодействия с базой данных избранных автомобилей.
 */
@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /**
     * Находит избранное по идентификатору.
     *
     * @param id идентификатор избранного
     * @return Optional с избранным или пустой Optional
     */
    Optional<Favorite> findById(Long id);

    /**
     * Получает все избранные автомобили пользователя.
     *
     * @param user пользователь
     * @return список избранных автомобилей
     */
    List<Favorite> findByUser(User user);

    /**
     * Проверяет, есть ли автомобиль в избранном у пользователя.
     *
     * @param user пользователь
     * @param car автомобиль
     * @return true, если автомобиль в избранном, иначе false
     */
    boolean existsByUserAndCar(User user, Car car);

    /**
     * Удаляет избранное по пользователю и автомобилю.
     *
     * @param user пользователь
     * @param car автомобиль
     */
    void deleteByUserAndCar(User user, Car car);

    /**
     * Находит избранное по пользователю и автомобилю.
     *
     * @param user пользователь
     * @param car автомобиль
     * @return Optional с избранным или пустой Optional
     */
    Optional<Favorite> findByUserAndCar(User user, Car car);
}