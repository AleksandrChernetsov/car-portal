package com.carportal.repository;

import com.carportal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Репозиторий для работы с пользователями.
 * Предоставляет методы для взаимодействия с базой данных пользователей.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Находит пользователя по имени.
     *
     * @param username имя пользователя
     * @return Optional с пользователем или пустой Optional
     */
    Optional<User> findByUsername(String username);

    /**
     * Находит пользователя по email.
     *
     * @param email email пользователя
     * @return Optional с пользователем или пустой Optional
     */
    Optional<User> findByEmail(String email);

    /**
     * Находит пользователя по идентификатору.
     *
     * @param id идентификатор пользователя
     * @return Optional с пользователем или пустой Optional
     */
    Optional<User> findById(Long id);
}