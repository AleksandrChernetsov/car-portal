package com.carportal.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Контроллер для получения серверного времени.
 * Предоставляет эндпоинт для получения текущего времени на сервере.
 */
@RestController
public class TimeController {

    /**
     * Получает текущее серверное время.
     *
     * @return отформатированная строка с текущей датой и временем
     */
    @GetMapping("/time")
    public ResponseEntity<String> getTime() {
        try {
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            return ResponseEntity.ok(now.format(formatter));
        } catch (Exception e) {
            System.err.println("Ошибка при получении времени сервера: " + e.getMessage());
            LocalDateTime fallbackTime = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            return ResponseEntity.internalServerError().body(fallbackTime.format(formatter));
        }
    }
}