package com.carportal.services;

import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.exception.EntityNotFoundException;
import com.carportal.models.News;
import com.carportal.repository.NewsRepository;
import com.carportal.utils.mapper.NewsMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для операций с новостями.
 * Обрабатывает логику получения новостей для всех пользователей.
 */
@Service
@AllArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;

    /**
     * Получает все новости.
     *
     * @return список новостей в формате NewsResponseDTO
     */
    public List<NewsResponseDTO> getAllNews() {
        List<News> newsList = newsRepository.findAll();
        return newsList.stream()
                .map(NewsMapper::newsToNewsResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получает новость по идентификатору.
     *
     * @param id идентификатор новости
     * @return данные новости в формате NewsResponseDTO
     */
    public NewsResponseDTO getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Новость с ID " + id + " не найдена"));
        return NewsMapper.newsToNewsResponseDTO(news);
    }

    /**
     * Ищет новости по ключевым словам.
     *
     * @param keyword ключевое слово для поиска
     * @return список найденных новостей
     */
    public List<NewsResponseDTO> searchNews(String keyword) {
        List<News> newsList = newsRepository.searchByKeyword(keyword);
        return newsList.stream()
                .map(NewsMapper::newsToNewsResponseDTO)
                .collect(Collectors.toList());
    }
}