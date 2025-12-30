package com.carportal;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Тестовый класс для проверки корректной загрузки контекста приложения CarPortal.
 * Этот тест гарантирует, что все компоненты Spring Boot приложения
 * могут быть успешно инициализированы и загружены в память.
 */
@SpringBootTest
class CarPortalApplicationTests {

    /**
     * Базовый тест, проверяющий успешную загрузку Spring контекста.
     * Если контекст загружается без ошибок, тест считается пройденным.
     * Этот тест служит "дымовым тестом" для всего приложения.
     */
    @Test
    void contextLoads() {
        // Тест автоматически проходит, если Spring контекст загружается без исключений
    }

}