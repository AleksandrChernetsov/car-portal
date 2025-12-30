package com.carportal.services;

import com.carportal.dto.response.CarResponseDTO;
import com.carportal.exception.EntityAlreadyExistsException;
import com.carportal.exception.EntityNotFoundException;
import com.carportal.exception.ValidateException;
import com.carportal.models.Car;
import com.carportal.models.Favorite;
import com.carportal.models.User;
import com.carportal.models.enums.CarStatus;
import com.carportal.repository.CarRepository;
import com.carportal.repository.FavoriteRepository;
import com.carportal.repository.UserRepository;
import com.carportal.utils.mapper.CarMapper;
import com.carportal.utils.security.UtilsSecurity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Сервис для операций с избранными автомобилями.
 * Обрабатывает логику управления избранными автомобилями пользователя.
 */
@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final UtilsSecurity utilsSecurity;

    /**
     * Получает все избранные автомобили текущего пользователя.
     *
     * @return список избранных автомобилей в формате CarResponseDTO
     */
    public List<CarResponseDTO> getUserFavorites() {
        User user = utilsSecurity.getCurrentUser();
        List<Favorite> favorites = favoriteRepository.findByUser(user);

        return favorites.stream()
                .map(favorite -> CarMapper.carToCarResponseDTO(favorite.getCar()))
                .collect(Collectors.toList());
    }

    /**
     * Добавляет автомобиль в избранное.
     *
     * @param carId идентификатор автомобиля
     */
    public void addFavorite(Long carId) {
        User user = utilsSecurity.getCurrentUser();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        if (car.getStatus() == CarStatus.SOLD) {
            throw new ValidateException("Нельзя добавить проданный автомобиль в избранное");
        }

        if (favoriteRepository.existsByUserAndCar(user, car)) {
            throw new EntityAlreadyExistsException("Автомобиль уже находится в избранном");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setCar(car);
        favoriteRepository.save(favorite);
        log.info("Автомобиль {} добавлен в избранное пользователя {}", carId, user.getId());
    }

    /**
     * Удаляет автомобиль из избранного.
     *
     * @param carId идентификатор автомобиля
     */
    public void removeFavorite(Long carId) {
        User user = utilsSecurity.getCurrentUser();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        Optional<Favorite> favorite = favoriteRepository.findByUserAndCar(user, car);
        if (favorite.isEmpty()) {
            throw new EntityNotFoundException("Автомобиль не находится в избранном");
        }

        favoriteRepository.delete(favorite.get());
        log.info("Автомобиль {} удален из избранного пользователя {}", carId, user.getId());
    }

    /**
     * Проверяет, находится ли автомобиль в избранном у текущего пользователя.
     *
     * @param carId идентификатор автомобиля
     * @return true, если автомобиль в избранном, иначе false
     */
    public boolean isFavorite(Long carId) {
        User user = utilsSecurity.getCurrentUser();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        return favoriteRepository.existsByUserAndCar(user, car);
    }
}