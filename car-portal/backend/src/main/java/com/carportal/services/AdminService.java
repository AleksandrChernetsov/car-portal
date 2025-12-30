package com.carportal.services;

import com.carportal.dto.request.AdminUserEditDTO;
import com.carportal.dto.request.CarRequestDTO;
import com.carportal.dto.request.NewsRequestDTO;
import com.carportal.dto.response.CarResponseDTO;
import com.carportal.dto.response.NewsResponseDTO;
import com.carportal.dto.response.UserResponseDTO;
import com.carportal.exception.EntityAlreadyExistsException;
import com.carportal.exception.EntityNotFoundException;
import com.carportal.exception.ValidateException;
import com.carportal.models.Car;
import com.carportal.models.News;
import com.carportal.models.User;
import com.carportal.models.enums.CarStatus;
import com.carportal.models.enums.UserRole;
import com.carportal.repository.CarRepository;
import com.carportal.repository.FavoriteRepository;
import com.carportal.repository.NewsRepository;
import com.carportal.repository.UserRepository;
import com.carportal.utils.mapper.CarMapper;
import com.carportal.utils.mapper.NewsMapper;
import com.carportal.utils.mapper.UserMapper;
import com.carportal.utils.security.UtilsSecurity;
import com.carportal.utils.validation.UserParamsValidator;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Сервис для административных операций.
 * Обрабатывает логику управления пользователями, автомобилями и новостями.
 */
@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final FavoriteRepository favoriteRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilsSecurity utilsSecurity;

    /**
     * Получает всех пользователей системы.
     *
     * @return список пользователей в формате UserResponseDTO
     */
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::userToUserResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получает всех пользователей, исключая текущего.
     *
     * @param currentUserId ID текущего пользователя (администратора)
     * @return список пользователей без текущего
     */
    public List<UserResponseDTO> getAllUsersExcludingCurrent(Long currentUserId) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .map(UserMapper::userToUserResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Редактирует данные пользователя.
     *
     * @param userId идентификатор пользователя
     * @param userEditDTO данные для редактирования
     * @return обновленные данные пользователя
     */
    public UserResponseDTO editUser(Long userId, AdminUserEditDTO userEditDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден!"));

        if (!Objects.equals(userId, user.getId())) {
            throw new EntityNotFoundException("Ошибка поиска пользователя...");
        }

        if (!user.getUsername().equals(userEditDTO.getUsername())) {
            if (userRepository.findByUsername(userEditDTO.getUsername()).isPresent()) {
                throw new EntityAlreadyExistsException("Пользователь", "имя", userEditDTO.getUsername());
            }
            UserParamsValidator.usernameValidate(userEditDTO.getUsername());
            user.setUsername(userEditDTO.getUsername());
        }

        if (userEditDTO.getPassword() != null && !userEditDTO.getPassword().isEmpty() &&
                !passwordEncoder.matches(userEditDTO.getPassword(), user.getPassword())) {
            UserParamsValidator.passwordValidate(userEditDTO.getPassword());
            user.setPassword(passwordEncoder.encode(userEditDTO.getPassword()));
        }

        if (!user.getEmail().equals(userEditDTO.getEmail())) {
            if (userRepository.findByEmail(userEditDTO.getEmail()).isPresent()) {
                throw new EntityAlreadyExistsException("Пользователь", "email", userEditDTO.getEmail());
            }
            UserParamsValidator.emailValidate(userEditDTO.getEmail());
            user.setEmail(userEditDTO.getEmail());
        }

        if (!EnumUtils.isValidEnum(UserRole.class, userEditDTO.getRole())) {
            throw new ValidateException("Такой роли не существует!");
        }
        user.setRole(UserRole.valueOf(userEditDTO.getRole()));

        String newPhone = userEditDTO.getPhone();
        if (newPhone != null && newPhone.trim().isEmpty()) {
            newPhone = null;
        }

        final String finalPhone = newPhone;

        if (newPhone != null ? !newPhone.equals(user.getPhone()) : user.getPhone() != null) {
            if (newPhone != null) {
                if (userRepository.findAll().stream()
                        .anyMatch(u -> finalPhone.equals(u.getPhone()) && !u.getId().equals(user.getId()))) {
                    throw new EntityAlreadyExistsException("Пользователь с таким телефоном уже существует!");
                }
                UserParamsValidator.phoneValidate(newPhone);
            }
            user.setPhone(newPhone);
        }

        User updatedUser = userRepository.save(user);
        return UserMapper.userToUserResponseDTO(updatedUser);
    }

    /**
     * Удаляет пользователя по идентификатору.
     *
     * @param userId идентификатор пользователя
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден!"));

        favoriteRepository.findByUser(user).forEach(favorite ->
                favoriteRepository.delete(favorite)
        );

        userRepository.delete(user);
    }

    /**
     * Изменяет аватар пользователя (для администратора).
     *
     * @param userId идентификатор пользователя
     * @param file файл изображения аватара
     * @return URL загруженного аватара
     */
    @Transactional
    public String changeUserAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден!"));

        log.info("Администратор {} меняет аватар пользователя: {}",
                utilsSecurity.getCurrentUser().getUsername(), user.getUsername());

        try {
            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/userImages/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String oldAvatar = user.getAvatar();
            if (oldAvatar != null && !oldAvatar.contains("defaultUserImage")) {
                try {
                    String oldFileName = oldAvatar.substring(oldAvatar.lastIndexOf("/") + 1);
                    Path oldFilePath = uploadPath.resolve(oldFileName);
                    if (Files.exists(oldFilePath)) {
                        Files.delete(oldFilePath);
                        log.info("Старый аватар удален: {}", oldFileName);
                    }
                } catch (Exception e) {
                    log.warn("Не удалось удалить старый аватар: {}", e.getMessage());
                }
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String fileName = user.getUsername() + "_admin_" + timestamp + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            String avatarUrl = "http://localhost:8080/images/userImages/" + fileName;
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            log.info("Аватар успешно изменен администратором: {}", fileName);
            return avatarUrl;

        } catch (Exception e) {
            log.error("Ошибка при изменении аватара пользователя: {}", e.getMessage());
            throw new RuntimeException("Ошибка при изменении аватара: " + e.getMessage());
        }
    }

    /**
     * Удаляет аватар пользователя и устанавливает аватар по умолчанию (для администратора).
     *
     * @param userId идентификатор пользователя
     * @return URL аватара по умолчанию
     */
    @Transactional
    public String deleteUserAvatar(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден!"));

        log.info("Администратор {} удаляет аватар пользователя: {}",
                utilsSecurity.getCurrentUser().getUsername(), user.getUsername());

        try {
            String currentAvatar = user.getAvatar();

            if (currentAvatar != null && !currentAvatar.contains("defaultUserImage")) {
                try {
                    String fileName = currentAvatar.substring(currentAvatar.lastIndexOf("/") + 1);
                    String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/userImages/";
                    Path filePath = Paths.get(uploadDir, fileName);

                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                        log.info("Файл аватара удален: {}", fileName);
                    }
                } catch (Exception e) {
                    log.warn("Не удалось удалить файл аватара: {}", e.getMessage());
                }
            }

            String defaultAvatarUrl = "http://localhost:8080/images/userImages/defaultUserImage.jpg";
            user.setAvatar(defaultAvatarUrl);
            userRepository.save(user);

            log.info("Аватар пользователя успешно сброшен к дефолтному");
            return defaultAvatarUrl;

        } catch (Exception e) {
            log.error("Ошибка при удалении аватара пользователя: {}", e.getMessage());
            throw new RuntimeException("Ошибка при удалении аватара: " + e.getMessage());
        }
    }

    /**
     * Получает все автомобили в каталоге.
     *
     * @return список автомобилей в формате CarResponseDTO
     */
    public List<CarResponseDTO> getAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(CarMapper::carToCarResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Добавляет новый автомобиль в каталог.
     *
     * @param carRequestDTO данные нового автомобиля
     * @return добавленный автомобиль
     */
    public CarResponseDTO addCar(CarRequestDTO carRequestDTO) {
        Car car = CarMapper.carRequestDTOtoCar(carRequestDTO);
        Car savedCar = carRepository.save(car);
        return CarMapper.carToCarResponseDTO(savedCar);
    }

    /**
     * Редактирует данные автомобиля.
     *
     * @param carId идентификатор автомобиля
     * @param carRequestDTO данные для редактирования
     * @return обновленные данные автомобиля
     */
    public CarResponseDTO editCar(Long carId, CarRequestDTO carRequestDTO) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        if (!Objects.equals(carId, car.getId())) {
            throw new EntityNotFoundException("Ошибка поиска автомобиля...");
        }

        CarMapper.updateCarFromDTO(carRequestDTO, car);
        Car updatedCar = carRepository.save(car);
        return CarMapper.carToCarResponseDTO(updatedCar);
    }

    /**
     * Удаляет автомобиль из каталога.
     *
     * @param carId идентификатор автомобиля
     */
    public void deleteCar(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        carRepository.delete(car);
    }

    /**
     * Загружает изображение для существующего автомобиля.
     *
     * @param carId идентификатор автомобиля
     * @param file файл изображения
     * @return URL загруженного изображения
     */
    @Transactional
    public String uploadCarImage(Long carId, MultipartFile file) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        log.info("Загрузка изображения для автомобиля {}: {}", carId, car.getBrand() + " " + car.getModel());

        try {
            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/carImages/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String oldImage = car.getImageUrl();
            if (oldImage != null && !oldImage.contains("default-car")) {
                try {
                    String oldFileName = oldImage.substring(oldImage.lastIndexOf("/") + 1);
                    Path oldFilePath = uploadPath.resolve(oldFileName);
                    if (Files.exists(oldFilePath)) {
                        Files.delete(oldFilePath);
                        log.info("Старое изображение автомобиля удалено: {}", oldFileName);
                    }
                } catch (Exception e) {
                    log.warn("Не удалось удалить старое изображение автомобиля: {}", e.getMessage());
                }
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String fileName = car.getBrand() + "_" + car.getModel() + "_" + carId + "_" + timestamp + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            String imageUrl = "http://localhost:8080/images/carImages/" + fileName;
            car.setImageUrl(imageUrl);
            carRepository.save(car);

            log.info("Изображение автомобиля успешно загружено: {}", fileName);
            return imageUrl;

        } catch (Exception e) {
            log.error("Ошибка при загрузке изображения автомобиля: {}", e.getMessage());
            throw new RuntimeException("Ошибка при загрузке изображения автомобиля: " + e.getMessage());
        }
    }

    /**
     * Загружает изображение для нового автомобиля (без carId).
     *
     * @param file файл изображения
     * @return URL загруженного изображения
     */
    @Transactional
    public String uploadCarImageForNewCar(MultipartFile file) {
        log.info("Загрузка изображения для нового автомобиля");

        try {
            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/carImages/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String fileName = "new_car_" + timestamp + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            String imageUrl = "http://localhost:8080/images/carImages/" + fileName;
            log.info("Изображение для нового автомобиля успешно загружено: {}", fileName);
            return imageUrl;

        } catch (Exception e) {
            log.error("Ошибка при загрузке изображения для нового автомобиля: {}", e.getMessage());
            throw new RuntimeException("Ошибка при загрузке изображения для нового автомобиля: " + e.getMessage());
        }
    }

    /**
     * Удаляет изображение автомобиля и устанавливает изображение по умолчанию.
     *
     * @param carId идентификатор автомобиля
     * @return URL изображения по умолчанию
     */
    @Transactional
    public String deleteCarImage(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Автомобиль не найден!"));

        log.info("Удаление изображения автомобиля {}: {}", carId, car.getBrand() + " " + car.getModel());

        try {
            String currentImage = car.getImageUrl();

            if (currentImage != null && !currentImage.contains("default-car")) {
                try {
                    String fileName = currentImage.substring(currentImage.lastIndexOf("/") + 1);
                    String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/carImages/";
                    Path filePath = Paths.get(uploadDir, fileName);

                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                        log.info("Файл изображения автомобиля удален: {}", fileName);
                    }
                } catch (Exception e) {
                    log.warn("Не удалось удалить файл изображения автомобиля: {}", e.getMessage());
                }
            }

            String defaultImageUrl = "http://localhost:8080/images/carImages/default-car.jpg";
            car.setImageUrl(defaultImageUrl);
            carRepository.save(car);

            log.info("Изображение автомобиля успешно сброшено к дефолтному");
            return defaultImageUrl;

        } catch (Exception e) {
            log.error("Ошибка при удалении изображения автомобиля: {}", e.getMessage());
            throw new RuntimeException("Ошибка при удалении изображения автомобиля: " + e.getMessage());
        }
    }

    /**
     * Получает все новости (для администратора).
     *
     * @return список новостей в формате NewsResponseDTO
     */
    public List<NewsResponseDTO> getAllNews() {
        try {
            log.info("Загрузка всех новостей для администратора");
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
            log.error("Критическая ошибка при загрузке новостей для администратора: {}", e.getMessage(), e);
            throw new RuntimeException("Ошибка при загрузке новостей. Пожалуйста, попробуйте позже.");
        }
    }

    /**
     * Добавляет новость (для администратора).
     *
     * @param newsRequestDTO данные новости
     * @return добавленная новость
     */
    public NewsResponseDTO addNews(NewsRequestDTO newsRequestDTO) {
        User user = utilsSecurity.getCurrentUser();
        News news = NewsMapper.newsRequestDTOtoNews(newsRequestDTO, user);
        News savedNews = newsRepository.save(news);
        return NewsMapper.newsToNewsResponseDTO(savedNews);
    }

    /**
     * Редактирует новость (для администратора).
     *
     * @param newsId идентификатор новости
     * @param newsRequestDTO данные новости
     * @return обновленная новость
     */
    public NewsResponseDTO editNews(Long newsId, NewsRequestDTO newsRequestDTO) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new EntityNotFoundException("Новость не найдена!"));

        news.setTitle(newsRequestDTO.getTitle());
        news.setContent(newsRequestDTO.getContent());
        news.setDate(LocalDate.now());

        News updatedNews = newsRepository.save(news);
        return NewsMapper.newsToNewsResponseDTO(updatedNews);
    }

    /**
     * Удаляет новость (для администратора).
     *
     * @param newsId идентификатор новости
     */
    public void deleteNews(Long newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new EntityNotFoundException("Новость не найдена!"));

        newsRepository.delete(news);
    }
}