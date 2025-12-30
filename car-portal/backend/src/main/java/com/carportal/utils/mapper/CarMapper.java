package com.carportal.utils.mapper;

import com.carportal.dto.request.CarRequestDTO;
import com.carportal.dto.response.CarResponseDTO;
import com.carportal.models.Car;
import com.carportal.models.enums.CarStatus;
import org.springframework.stereotype.Component;

/**
 * Маппер для преобразования между сущностью Car и DTO.
 * Содержит методы для конвертации данных автомобиля.
 */
@Component
public abstract class CarMapper {

    /**
     * Преобразует CarRequestDTO в сущность Car.
     *
     * @param carRequestDTO DTO с данными автомобиля
     * @return сущность Car
     */
    public static Car carRequestDTOtoCar(CarRequestDTO carRequestDTO) {
        Car car = new Car();
        car.setBrand(carRequestDTO.getBrand());
        car.setModel(carRequestDTO.getModel());
        car.setYear(carRequestDTO.getYear());
        car.setPrice(carRequestDTO.getPrice());
        car.setDescription(carRequestDTO.getDescription());
        car.setImageUrl(carRequestDTO.getImageUrl() != null && !carRequestDTO.getImageUrl().isEmpty() ?
                carRequestDTO.getImageUrl() : "http://localhost:8080/images/carImages/default-car.jpg");

        if (carRequestDTO.getIsAvailable() != null) {
            car.setStatus(carRequestDTO.getIsAvailable() ? CarStatus.AVAILABLE : CarStatus.SOLD);
        } else {
            car.setStatus(CarStatus.AVAILABLE);
        }
        return car;
    }

    /**
     * Преобразует сущность Car в CarResponseDTO.
     *
     * @param car сущность автомобиля
     * @return DTO с данными автомобиля
     */
    public static CarResponseDTO carToCarResponseDTO(Car car) {
        return new CarResponseDTO(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getPrice(),
                car.getDescription(),
                car.getImageUrl(),
                car.getStatus() == CarStatus.AVAILABLE,
                car.getSeller() != null ? car.getSeller().getId() : null,
                car.getSeller() != null ? car.getSeller().getUsername() : null
        );
    }

    /**
     * Обновляет данные автомобиля из CarRequestDTO.
     *
     * @param carRequestDTO DTO с обновленными данными
     * @param car сущность автомобиля для обновления
     */
    public static void updateCarFromDTO(CarRequestDTO carRequestDTO, Car car) {
        if (carRequestDTO.getBrand() != null) car.setBrand(carRequestDTO.getBrand());
        if (carRequestDTO.getModel() != null) car.setModel(carRequestDTO.getModel());
        if (carRequestDTO.getYear() != 0) car.setYear(carRequestDTO.getYear());
        if (carRequestDTO.getPrice() != 0) car.setPrice(carRequestDTO.getPrice());
        if (carRequestDTO.getDescription() != null) car.setDescription(carRequestDTO.getDescription());
        if (carRequestDTO.getImageUrl() != null && !carRequestDTO.getImageUrl().isEmpty()) {
            car.setImageUrl(carRequestDTO.getImageUrl());
        }

        if (carRequestDTO.getIsAvailable() != null) {
            car.setStatus(carRequestDTO.getIsAvailable() ? CarStatus.AVAILABLE : CarStatus.SOLD);
        }
    }
}