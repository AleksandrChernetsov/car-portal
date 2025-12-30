package com.carportal.repository;

import com.carportal.models.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для работы с автомобилями.
 * Предоставляет методы для взаимодействия с базой данных автомобилей.
 */
@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    /**
     * Находит автомобиль по идентификатору.
     *
     * @param id идентификатор автомобиля
     * @return Optional с автомобилем или пустой Optional
     */
    Optional<Car> findById(Long id);

    /**
     * Получает все автомобили.
     *
     * @return список всех автомобилей
     */
    List<Car> findAll();

    /**
     * Находит автомобили по марке.
     *
     * @param brand марка автомобиля
     * @return список автомобилей указанной марки
     */
    List<Car> findByBrand(String brand);

    /**
     * Находит автомобили в указанном ценовом диапазоне.
     *
     * @param minPrice минимальная цена
     * @param maxPrice максимальная цена
     * @return список автомобилей в указанном ценовом диапазоне
     */
    List<Car> findByPriceBetween(double minPrice, double maxPrice);
}