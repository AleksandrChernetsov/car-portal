package com.carportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Основной класс приложения автомобильного портала.
 * Запускает Spring Boot приложение с настройками по умолчанию.
 */
@SpringBootApplication
public class CarPortalApplication {

    /**
     * Точка входа в приложение.
     *
     * @param args аргументы командной строки
     */
    public static void main(String[] args) {
        SpringApplication.run(CarPortalApplication.class, args);
    }
}