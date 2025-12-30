package com.carportal.controllers;

import com.carportal.dto.response.CarResponseDTO;
import com.carportal.services.FavoriteService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер для операций с избранными автомобилями.
 * Обрабатывает запросы, связанные с управлением избранными автомобилями пользователя.
 */
@RestController
@RequestMapping("/favorites")
@AllArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * Получает все избранные автомобили текущего пользователя.
     *
     * @return список избранных автомобилей в формате CarResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<CarResponseDTO>> getUserFavorites() {
        List<CarResponseDTO> favorites = favoriteService.getUserFavorites();
        return ResponseEntity.ok(favorites);
    }

    /**
     * Добавляет автомобиль в избранное.
     *
     * @param carId идентификатор автомобиля
     * @return сообщение об успешном добавлении
     */
    @PostMapping("/add/{carId}")
    public ResponseEntity<String> addFavorite(@PathVariable Long carId) {
        favoriteService.addFavorite(carId);
        return ResponseEntity.ok("Автомобиль добавлен в избранное");
    }

    /**
     * Удаляет автомобиль из избранного.
     *
     * @param carId идентификатор автомобиля
     * @return сообщение об успешном удалении
     */
    @DeleteMapping("/remove/{carId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Long carId) {
        favoriteService.removeFavorite(carId);
        return ResponseEntity.ok("Автомобиль удален из избранного");
    }

    /**
     * Проверяет, находится ли автомобиль в избранном у текущего пользователя.
     *
     * @param carId идентификатор автомобиля
     * @return true, если автомобиль в избранном, иначе false
     */
    @GetMapping("/check/{carId}")
    public ResponseEntity<Boolean> isFavorite(@PathVariable Long carId) {
        boolean isFavorite = favoriteService.isFavorite(carId);
        return ResponseEntity.ok(isFavorite);
    }
}