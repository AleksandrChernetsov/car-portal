package com.carportal.utils.mapper;

import com.carportal.dto.request.NewsRequestDTO;
import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.models.News;
import com.carportal.models.User;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Маппер для преобразования между сущностью News и DTO.
 * Содержит методы для конвертации данных новостей.
 */
@Component
public abstract class NewsMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    /**
     * Преобразует NewsRequestDTO в сущность News.
     *
     * @param newsRequestDTO DTO с данными новости
     * @param user автор новости
     * @return сущность News
     */
    public static News newsRequestDTOtoNews(NewsRequestDTO newsRequestDTO, User user) {
        News news = new News();
        news.setUser(user);
        news.setTitle(newsRequestDTO.getTitle());
        news.setContent(newsRequestDTO.getContent());
        news.setDate(LocalDate.now());
        return news;
    }

    /**
     * Преобразует сущность News в NewsResponseDTO.
     *
     * @param news сущность новости
     * @return DTO с данными новости
     */
    public static NewsResponseDTO newsToNewsResponseDTO(News news) {
        if (news == null) {
            return null;
        }

        String author = (news.getUser() != null && news.getUser().getUsername() != null)
                ? news.getUser().getUsername()
                : "Неизвестный автор";

        String title = news.getTitle() != null ? news.getTitle() : "Без заголовка";
        String content = news.getContent() != null ? news.getContent() : "";
        String date = news.getDate() != null ? news.getDate().format(DATE_FORMATTER) : LocalDate.now().format(DATE_FORMATTER);

        return new NewsResponseDTO(news.getId(), author, title, content, date);
    }

    /**
     * Преобразует список сущностей News в список NewsResponseDTO.
     *
     * @param newsList список сущностей новостей
     * @return список DTO с данными новостей
     */
    public static List<NewsResponseDTO> newsListToNewsResponseDTOList(List<News> newsList) {
        if (newsList == null) {
            return List.of();
        }

        return newsList.stream()
                .map(NewsMapper::newsToNewsResponseDTO)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}