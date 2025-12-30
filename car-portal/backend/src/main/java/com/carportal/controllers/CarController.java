package com.carportal.controllers;

import com.carportal.dto.response.CarResponseDTO;
import com.carportal.services.CarService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер для операций с автомобилями.
 * Обрабатывает запросы, связанные с каталогом автомобилей.
 */
@RestController
@RequestMapping("/cars")
@AllArgsConstructor
public class CarController {

    private final CarService carService;

    /**
     * Получает все автомобили в каталоге.
     *
     * @return список автомобилей в формате CarResponseDTO
     */
    @GetMapping("/catalog")
    public ResponseEntity<List<CarResponseDTO>> getAllCars() {
        List<CarResponseDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    /**
     * Получает автомобиль по идентификатору.
     *
     * @param id идентификатор автомобиля
     * @return данные автомобиля в формате CarResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<CarResponseDTO> getCarById(@PathVariable Long id) {
        CarResponseDTO car = carService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    /**
     * Получает автомобили по марке.
     *
     * @param brand марка автомобиля
     * @return список автомобилей указанной марки
     */
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<CarResponseDTO>> getCarsByBrand(@PathVariable String brand) {
        List<CarResponseDTO> cars = carService.getCarsByBrand(brand);
        return ResponseEntity.ok(cars);
    }

    /**
     * Получает автомобили в указанном ценовом диапазоне.
     *
     * @param minPrice минимальная цена
     * @param maxPrice максимальная цена
     * @return список автомобилей в указанном ценовом диапазоне
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<CarResponseDTO>> getCarsByPriceRange(@RequestParam double minPrice, @RequestParam double maxPrice) {
        List<CarResponseDTO> cars = carService.getCarsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(cars);
    }
}