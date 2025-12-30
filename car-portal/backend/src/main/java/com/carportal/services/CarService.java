package com.carportal.services;

import com.carportal.dto.response.CarResponseDTO;
import com.carportal.exception.EntityNotFoundException;
import com.carportal.models.Car;
import com.carportal.repository.CarRepository;
import com.carportal.utils.mapper.CarMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для операций с автомобилями.
 * Обрабатывает логику работы с каталогом автомобилей.
 */
@Service
@AllArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    /**
     * Получает все автомобили в каталоге.
     *
     * @return список автомобилей в формате CarResponseDTO
     */
    public List<CarResponseDTO> getAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(CarMapper::carToCarResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получает автомобиль по идентификатору.
     *
     * @param id идентификатор автомобиля
     * @return данные автомобиля в формате CarResponseDTO
     */
    public CarResponseDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль с ID " + id + " не найден"));
        return CarMapper.carToCarResponseDTO(car);
    }

    /**
     * Получает автомобили по марке.
     *
     * @param brand марка автомобиля
     * @return список автомобилей указанной марки
     */
    public List<CarResponseDTO> getCarsByBrand(String brand) {
        List<Car> cars = carRepository.findByBrand(brand);
        return cars.stream()
                .map(CarMapper::carToCarResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получает автомобили в указанном ценовом диапазоне.
     *
     * @param minPrice минимальная цена
     * @param maxPrice максимальная цена
     * @return список автомобилей в указанном ценовом диапазоне
     */
    public List<CarResponseDTO> getCarsByPriceRange(double minPrice, double maxPrice) {
        List<Car> cars = carRepository.findByPriceBetween(minPrice, maxPrice);
        return cars.stream()
                .map(CarMapper::carToCarResponseDTO)
                .collect(Collectors.toList());
    }
}