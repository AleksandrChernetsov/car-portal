package com.carportal.controllers;

import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.services.NewsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер для операций с новостями.
 * Обрабатывает запросы на получение новостей для всех пользователей.
 */
@RestController
@RequestMapping("/news")
@AllArgsConstructor
public class NewsController {

    private final NewsService newsService;

    /**
     * Получает все новости.
     *
     * @return список новостей в формате NewsResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<NewsResponseDTO>> getAllNews() {
        List<NewsResponseDTO> news = newsService.getAllNews();
        return ResponseEntity.ok(news);
    }

    /**
     * Получает новость по идентификатору.
     *
     * @param id идентификатор новости
     * @return данные новости в формате NewsResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        NewsResponseDTO news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    /**
     * Ищет новости по ключевым словам.
     *
     * @param keyword ключевое слово для поиска
     * @return список найденных новостей
     */
    @GetMapping("/search")
    public ResponseEntity<List<NewsResponseDTO>> searchNews(@RequestParam String keyword) {
        List<NewsResponseDTO> news = newsService.searchNews(keyword);
        return ResponseEntity.ok(news);
    }
}