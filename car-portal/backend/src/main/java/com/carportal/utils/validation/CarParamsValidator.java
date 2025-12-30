package com.carportal.utils.validation;

import com.carportal.dto.request.CarRequestDTO;
import com.carportal.exception.ValidateException;

/**
 * Утилитный класс для валидации параметров автомобиля.
 * Содержит методы для проверки корректности данных автомобиля.
 */
public abstract class CarParamsValidator {

    private static final String BRAND_REGEX = "^[a-zA-Zа-яА-Я0-9\\s]+$";
    private static final String MODEL_REGEX = "^[a-zA-Zа-яА-Я0-9\\s-]+$";

    /**
     * Валидирует марку автомобиля.
     *
     * @param brand марка автомобиля
     */
    public static void validateBrand(String brand) {
        if (brand == null || brand.trim().isEmpty()) {
            throw new ValidateException("Марка автомобиля не может быть пустой");
        }
        if (!brand.matches(BRAND_REGEX)) {
            throw new ValidateException("Марка автомобиля содержит недопустимые символы");
        }
        if (brand.length() < 2 || brand.length() > 50) {
            throw new ValidateException("Марка автомобиля должна содержать от 2 до 50 символов");
        }
    }

    /**
     * Валидирует модель автомобиля.
     *
     * @param model модель автомобиля
     */
    public static void validateModel(String model) {
        if (model == null || model.trim().isEmpty()) {
            throw new ValidateException("Модель автомобиля не может быть пустой");
        }
        if (!model.matches(MODEL_REGEX)) {
            throw new ValidateException("Модель автомобиля содержит недопустимые символы");
        }
        if (model.length() < 2 || model.length() > 50) {
            throw new ValidateException("Модель автомобиля должна содержать от 2 до 50 символов");
        }
    }

    /**
     * Валидирует год выпуска автомобиля.
     *
     * @param year год выпуска
     */
    public static void validateYear(int year) {
        int currentYear = java.time.Year.now().getValue();
        if (year < 1886 || year > currentYear + 1) {
            throw new ValidateException("Год выпуска должен быть в диапазоне от 1886 до " + (currentYear + 1));
        }
    }

    /**
     * Валидирует цену автомобиля.
     *
     * @param price цена автомобиля
     */
    public static void validatePrice(double price) {
        if (price < 0) {
            throw new ValidateException("Цена автомобиля не может быть отрицательной");
        }
        if (price > 1_000_000_000) {
            throw new ValidateException("Цена автомобиля не может превышать 1 миллиард");
        }
    }

    /**
     * Валидирует все параметры автомобиля из CarRequestDTO.
     *
     * @param carRequestDTO DTO с данными автомобиля
     */
    public static void validateCarParams(CarRequestDTO carRequestDTO) {
        validateBrand(carRequestDTO.getBrand());
        validateModel(carRequestDTO.getModel());
        validateYear(carRequestDTO.getYear());
        validatePrice(carRequestDTO.getPrice());

        if (carRequestDTO.getDescription() != null && carRequestDTO.getDescription().length() > 1000) {
            throw new ValidateException("Описание автомобиля не может превышать 1000 символов");
        }
    }
}