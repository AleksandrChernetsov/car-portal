package com.carportal.controllers;

import com.carportal.dto.request.NewsRequestDTO;
import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.services.ModeratorService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер для операций модератора.
 * Предоставляет API для управления новостями.
 */
@RestController
@RequestMapping("/moderator")
@AllArgsConstructor
public class ModeratorController {

    private final ModeratorService moderatorService;

    /**
     * Получает все новости.
     *
     * @return список новостей в формате NewsResponseDTO
     */
    @GetMapping("/news")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<List<NewsResponseDTO>> getAllNews() {
        List<NewsResponseDTO> news = moderatorService.getAllNews();
        return ResponseEntity.ok(news);
    }

    /**
     * Добавляет новую новость.
     *
     * @param newsRequestDTO данные новой новости
     * @return добавленная новость
     */
    @PostMapping("/news/add")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<NewsResponseDTO> addNews(@RequestBody NewsRequestDTO newsRequestDTO) {
        NewsResponseDTO newNews = moderatorService.addNews(newsRequestDTO);
        return ResponseEntity.ok(newNews);
    }

    /**
     * Редактирует существующую новость.
     *
     * @param newsId идентификатор новости
     * @param newsRequestDTO обновленные данные новости
     * @return обновленная новость
     */
    @PostMapping("/news/{newsId}/edit")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<NewsResponseDTO> editNews(@PathVariable Long newsId, @RequestBody NewsRequestDTO newsRequestDTO) {
        NewsResponseDTO updatedNews = moderatorService.editNews(newsId, newsRequestDTO);
        return ResponseEntity.ok(updatedNews);
    }

    /**
     * Удаляет новость по идентификатору.
     *
     * @param newsId идентификатор новости
     * @return сообщение об успешном удалении
     */
    @DeleteMapping("/news/{newsId}/delete")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<String> deleteNews(@PathVariable Long newsId) {
        moderatorService.deleteNews(newsId);
        return ResponseEntity.ok("Новость успешно удалена");
    }
}