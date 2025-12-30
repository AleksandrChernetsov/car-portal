package com.carportal.repository;

import com.carportal.models.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для работы с новостями.
 * Предоставляет методы для взаимодействия с базой данных новостей.
 */
@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    /**
     * Находит новость по идентификатору.
     *
     * @param id идентификатор новости
     * @return Optional с новостью или пустой Optional
     */
    Optional<News> findById(Long id);

    /**
     * Получает все новости.
     *
     * @return список всех новостей
     */
    List<News> findAll();

    /**
     * Находит новости по заголовку.
     *
     * @param title заголовок новости
     * @return Optional с новостью или пустой Optional
     */
    Optional<News> findByTitle(String title);

    /**
     * Ищет новости по ключевым словам в заголовке или содержании.
     *
     * @param keyword ключевое слово для поиска
     * @return список найденных новостей
     */
    @Query("SELECT n FROM News n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<News> searchByKeyword(@Param("keyword") String keyword);
}