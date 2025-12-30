package com.carportal.services;

import com.carportal.dto.request.NewsRequestDTO;
import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.exception.EntityNotFoundException;
import com.carportal.models.News;
import com.carportal.models.User;
import com.carportal.repository.NewsRepository;
import com.carportal.utils.mapper.NewsMapper;
import com.carportal.utils.security.UtilsSecurity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Сервис для операций модератора.
 * Обрабатывает логику управления новостями.
 */
@Service
@AllArgsConstructor
@Slf4j
public class ModeratorService {

    private final NewsRepository newsRepository;
    private final UtilsSecurity utilsSecurity;

    /**
     * Получает все новости.
     *
     * @return список новостей в формате NewsResponseDTO
     */
    public List<NewsResponseDTO> getAllNews() {
        try {
            log.info("Загрузка всех новостей для модератора");
            List<News> newsList = newsRepository.findAll();
            log.info("Найдено {} новостей", newsList.size());

            if (newsList.isEmpty()) {
                log.warn("Список новостей пуст");
                return List.of();
            }

            return newsList.stream()
                    .map(news -> {
                        try {
                            return NewsMapper.newsToNewsResponseDTO(news);
                        } catch (Exception e) {
                            log.error("Ошибка при преобразовании новости с ID {}: {}", news.getId(), e.getMessage());
                            return new NewsResponseDTO(
                                    news.getId(),
                                    "Неизвестный автор",
                                    news.getTitle() != null ? news.getTitle() : "Без заголовка",
                                    news.getContent() != null ? news.getContent() : "",
                                    news.getDate() != null ? news.getDate().toString() : LocalDate.now().toString()
                            );
                        }
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Критическая ошибка при загрузке новостей: {}", e.getMessage(), e);
            throw new RuntimeException("Ошибка при загрузке новостей. Пожалуйста, попробуйте позже.");
        }
    }

    /**
     * Добавляет новую новость.
     *
     * @param newsRequestDTO данные новой новости
     * @return добавленная новость в формате NewsResponseDTO
     */
    public NewsResponseDTO addNews(NewsRequestDTO newsRequestDTO) {
        try {
            User user = utilsSecurity.getCurrentUser();
            log.info("Добавление новости пользователем {}", user.getUsername());

            News news = NewsMapper.newsRequestDTOtoNews(newsRequestDTO, user);
            News savedNews = newsRepository.save(news);
            log.info("Новость успешно добавлена с ID {}", savedNews.getId());

            return NewsMapper.newsToNewsResponseDTO(savedNews);
        } catch (Exception e) {
            log.error("Ошибка при добавлении новости: {}", e.getMessage(), e);
            throw new RuntimeException("Ошибка при добавлении новости: " + e.getMessage());
        }
    }

    /**
     * Редактирует существующую новость.
     *
     * @param newsId идентификатор новости
     * @param newsRequestDTO обновленные данные новости
     * @return обновленная новость в формате NewsResponseDTO
     */
    public NewsResponseDTO editNews(Long newsId, NewsRequestDTO newsRequestDTO) {
        try {
            log.info("Редактирование новости с ID {}", newsId);

            News news = newsRepository.findById(newsId)
                    .orElseThrow(() -> {
                        log.error("Новость с ID {} не найдена", newsId);
                        return new EntityNotFoundException("Новость не найдена!");
                    });

            if (!Objects.equals(newsId, news.getId())) {
                log.error("Несоответствие ID новости. Ожидалось: {}, получено: {}", newsId, news.getId());
                throw new EntityNotFoundException("Ошибка поиска новости...");
            }

            news.setTitle(newsRequestDTO.getTitle());
            news.setContent(newsRequestDTO.getContent());
            news.setDate(LocalDate.now());

            News updatedNews = newsRepository.save(news);
            log.info("Новость с ID {} успешно обновлена", updatedNews.getId());

            return NewsMapper.newsToNewsResponseDTO(updatedNews);
        } catch (Exception e) {
            log.error("Ошибка при редактировании новости с ID {}: {}", newsId, e.getMessage(), e);
            throw new RuntimeException("Ошибка при редактировании новости: " + e.getMessage());
        }
    }

    /**
     * Удаляет новость по идентификатору.
     *
     * @param newsId идентификатор новости
     */
    public void deleteNews(Long newsId) {
        try {
            log.info("Удаление новости с ID {}", newsId);

            News news = newsRepository.findById(newsId)
                    .orElseThrow(() -> {
                        log.error("Новость с ID {} не найдена для удаления", newsId);
                        return new EntityNotFoundException("Новость не найдена!");
                    });

            newsRepository.delete(news);
            log.info("Новость с ID {} успешно удалена", newsId);
        } catch (Exception e) {
            log.error("Ошибка при удалении новости с ID {}: {}", newsId, e.getMessage(), e);
            throw new RuntimeException("Ошибка при удалении новости: " + e.getMessage());
        }
    }
}