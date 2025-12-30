package com.carportal.controllers;

import com.carportal.dto.request.AdminUserEditDTO;
import com.carportal.dto.request.CarRequestDTO;
import com.carportal.dto.request.NewsRequestDTO;
import com.carportal.dto.response.CarResponseDTO;
import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.dto.response.UserResponseDTO;
import com.carportal.services.AdminService;
import com.carportal.utils.security.UtilsSecurity;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Контроллер для административных операций.
 * Предоставляет API для управления пользователями, автомобилями и новостями.
 */
@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UtilsSecurity utilsSecurity;

    /**
     * Получает всех пользователей, исключая текущего администратора.
     *
     * @return список пользователей
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        Long currentUserId = utilsSecurity.getCurrentUser().getId();
        List<UserResponseDTO> users = adminService.getAllUsersExcludingCurrent(currentUserId);
        return ResponseEntity.ok(users);
    }

    /**
     * Редактирует данные пользователя.
     *
     * @param userId идентификатор пользователя
     * @param userEditDTO данные для редактирования
     * @return обновленные данные пользователя
     */
    @PostMapping("/users/{userId}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> editUser(@PathVariable Long userId, @RequestBody AdminUserEditDTO userEditDTO) {
        userEditDTO.setId(userId);
        return ResponseEntity.ok(adminService.editUser(userId, userEditDTO));
    }

    /**
     * Удаляет пользователя по идентификатору.
     *
     * @param userId идентификатор пользователя
     * @return сообщение об успешном удалении
     */
    @DeleteMapping("/users/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("Пользователь удален");
    }

    /**
     * Изменяет аватар пользователя.
     *
     * @param userId идентификатор пользователя
     * @param file файл изображения
     * @return URL нового аватара
     */
    @PostMapping("/users/{userId}/avatar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeUserAvatar(@PathVariable Long userId,
                                                   @RequestParam("file") MultipartFile file) {
        String avatarUrl = adminService.changeUserAvatar(userId, file);
        return ResponseEntity.ok(avatarUrl);
    }

    /**
     * Удаляет аватар пользователя.
     *
     * @param userId идентификатор пользователя
     * @return URL аватара по умолчанию
     */
    @DeleteMapping("/users/{userId}/avatar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUserAvatar(@PathVariable Long userId) {
        String defaultAvatarUrl = adminService.deleteUserAvatar(userId);
        return ResponseEntity.ok(defaultAvatarUrl);
    }

    /**
     * Получает все автомобили.
     *
     * @return список автомобилей
     */
    @GetMapping("/cars")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CarResponseDTO>> getAllCars() {
        return ResponseEntity.ok(adminService.getAllCars());
    }

    /**
     * Добавляет новый автомобиль.
     *
     * @param carRequestDTO данные автомобиля
     * @return добавленный автомобиль
     */
    @PostMapping("/cars/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarResponseDTO> addCar(@RequestBody CarRequestDTO carRequestDTO) {
        return ResponseEntity.ok(adminService.addCar(carRequestDTO));
    }

    /**
     * Редактирует данные автомобиля.
     *
     * @param carId идентификатор автомобиля
     * @param carRequestDTO обновленные данные автомобиля
     * @return обновленный автомобиль
     */
    @PostMapping("/cars/{carId}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarResponseDTO> editCar(@PathVariable Long carId, @RequestBody CarRequestDTO carRequestDTO) {
        return ResponseEntity.ok(adminService.editCar(carId, carRequestDTO));
    }

    /**
     * Удаляет автомобиль.
     *
     * @param carId идентификатор автомобиля
     * @return сообщение об успешном удалении
     */
    @DeleteMapping("/cars/{carId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCar(@PathVariable Long carId) {
        adminService.deleteCar(carId);
        return ResponseEntity.ok("Автомобиль удален");
    }

    /**
     * Загружает изображение для автомобиля.
     *
     * @param carId идентификатор автомобиля
     * @param file файл изображения
     * @return URL загруженного изображения
     */
    @PostMapping("/cars/{carId}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadCarImage(@PathVariable Long carId,
                                                 @RequestParam("file") MultipartFile file) {
        String imageUrl = adminService.uploadCarImage(carId, file);
        return ResponseEntity.ok(imageUrl);
    }

    /**
     * Удаляет изображение автомобиля.
     *
     * @param carId идентификатор автомобиля
     * @return URL изображения по умолчанию
     */
    @DeleteMapping("/cars/{carId}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCarImage(@PathVariable Long carId) {
        String defaultImageUrl = adminService.deleteCarImage(carId);
        return ResponseEntity.ok(defaultImageUrl);
    }

    /**
     * Загружает изображение для нового автомобиля.
     *
     * @param file файл изображения
     * @return URL загруженного изображения
     */
    @PostMapping("/cars/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadCarImageForNewCar(@RequestParam("file") MultipartFile file) {
        String imageUrl = adminService.uploadCarImageForNewCar(file);
        return ResponseEntity.ok(imageUrl);
    }

    /**
     * Получает все новости.
     *
     * @return список новостей
     */
    @GetMapping("/news")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NewsResponseDTO>> getAllNewsForAdmin() {
        List<NewsResponseDTO> news = adminService.getAllNews();
        return ResponseEntity.ok(news);
    }

    /**
     * Добавляет новую новость.
     *
     * @param newsRequestDTO данные новости
     * @return добавленная новость
     */
    @PostMapping("/news/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponseDTO> addNews(@RequestBody NewsRequestDTO newsRequestDTO) {
        return ResponseEntity.ok(adminService.addNews(newsRequestDTO));
    }

    /**
     * Редактирует новость.
     *
     * @param newsId идентификатор новости
     * @param newsRequestDTO обновленные данные новости
     * @return обновленная новость
     */
    @PostMapping("/news/{newsId}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponseDTO> editNews(@PathVariable Long newsId, @RequestBody NewsRequestDTO newsRequestDTO) {
        return ResponseEntity.ok(adminService.editNews(newsId, newsRequestDTO));
    }

    /**
     * Удаляет новость.
     *
     * @param newsId идентификатор новости
     * @return сообщение об успешном удалении
     */
    @DeleteMapping("/news/{newsId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteNews(@PathVariable Long newsId) {
        adminService.deleteNews(newsId);
        return ResponseEntity.ok("Новость удалена");
    }
}