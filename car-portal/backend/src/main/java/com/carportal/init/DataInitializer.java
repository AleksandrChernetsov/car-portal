package com.carportal.init;

import com.carportal.models.Car;
import com.carportal.models.News;
import com.carportal.models.User;
import com.carportal.models.enums.CarStatus;
import com.carportal.models.enums.UserRole;
import com.carportal.repository.CarRepository;
import com.carportal.repository.NewsRepository;
import com.carportal.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Компонент для инициализации базы данных тестовыми данными.
 * Запускается при старте приложения.
 */
@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Запускает инициализацию данных при старте приложения.
     *
     * @param args аргументы командной строки
     * @throws Exception если произошла ошибка при инициализации
     */
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        if (carRepository.count() == 0) {
            initializeCars();
        }
        if (newsRepository.count() == 0) {
            initializeNews();
        }
    }

    /**
     * Инициализирует тестовых пользователей.
     */
    private void initializeUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@carportal.ru");
        admin.setRole(UserRole.ADMIN);
        admin.setAvatar("http://localhost:8080/images/userImages/defaultUserImage.jpg");
        admin.setPhone("+7 (495) 111-11-11");
        admin.setVisitCount(5);

        User moderator = new User();
        moderator.setUsername("moderator");
        moderator.setPassword(passwordEncoder.encode("moderator123"));
        moderator.setEmail("moderator@carportal.ru");
        moderator.setRole(UserRole.MODERATOR);
        moderator.setAvatar("http://localhost:8080/images/userImages/defaultUserImage.jpg");
        moderator.setPhone("+7 (495) 222-22-22");
        moderator.setVisitCount(3);

        User user = new User();
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setEmail("user@carportal.ru");
        user.setRole(UserRole.USER);
        user.setAvatar("http://localhost:8080/images/userImages/defaultUserImage.jpg");
        user.setPhone("+7 (495) 333-33-33");
        user.setVisitCount(1);

        userRepository.saveAll(List.of(admin, moderator, user));
    }

    /**
     * Инициализирует тестовые автомобили.
     */
    private void initializeCars() {
        List<Car> cars = List.of(
                createCar("Toyota", "Camry", 2022, 2500000.00,
                        "Отличный семейный седан с высоким уровнем комфорта и надежности.",
                        "http://localhost:8080/images/carImages/toyota_camry.jpg", CarStatus.AVAILABLE),
                createCar("BMW", "X5", 2021, 4800000.00,
                        "Премиальный кроссовер с мощным двигателем и полным приводом.",
                        "http://localhost:8080/images/carImages/bmw_x5.jpg", CarStatus.AVAILABLE),
                createCar("Audi", "A4", 2020, 2100000.00,
                        "Элегантный седан бизнес-класса с отличными ходовыми характеристиками.",
                        "http://localhost:8080/images/carImages/audi_a4.jpg", CarStatus.AVAILABLE),
                createCar("Kia", "Rio", 2023, 1600000.00,
                        "Современный компактный седан с отличной экономичностью и надежностью.",
                        "http://localhost:8080/images/carImages/kia_rio.jpg", CarStatus.AVAILABLE),
                createCar("Volkswagen", "Passat", 2019, 1800000.00,
                        "Надежный семейный автомобиль с просторным салоном и большим багажником.",
                        "http://localhost:8080/images/carImages/default-car.jpg", CarStatus.SOLD),
                createCar("Lada", "Vesta", 2022, 950000.00,
                        "Российский седан с хорошим соотношением цены и качества.",
                        "http://localhost:8080/images/carImages/lada_vesta.jpg", CarStatus.AVAILABLE),
                createCar("Mercedes-Benz", "C-Class", 2021, 3500000.00,
                        "Премиальный седан с безупречной управляемостью и комфортом.",
                        "http://localhost:8080/images/carImages/default-car.jpg", CarStatus.AVAILABLE),
                createCar("Hyundai", "Solaris", 2020, 1100000.00,
                        "Популярный корейский седан с отличной надежностью и экономичностью.",
                        "http://localhost:8080/images/carImages/default-car.jpg", CarStatus.SOLD),
                createCar("Mitsubishi", "Outlander", 2022, 2800000.00,
                        "Вместительный кроссовер с полным приводом и высоким клиренсом.",
                        "http://localhost:8080/images/carImages/default-car.jpg", CarStatus.AVAILABLE)
        );

        for (Car car : cars) {
            System.out.println("Создаем автомобиль: " + car.getBrand() + " " + car.getModel() +
                    " с статусом: " + car.getStatus());
        }
        carRepository.saveAll(cars);

        List<Car> savedCars = carRepository.findAll();
        for (Car car : savedCars) {
            System.out.println("Сохранен автомобиль: " + car.getBrand() + " " + car.getModel() +
                    " с ID: " + car.getId() + " и статусом: " + car.getStatus());
        }
    }

    /**
     * Инициализирует тестовые новости.
     */
    private void initializeNews() {
        User moderator = userRepository.findByUsername("moderator")
                .orElseThrow(() -> new RuntimeException("Модератор не найден"));
        List<News> newsList = List.of(
                createNews(moderator, "Новые электромобили Tesla на российском рынке",
                        "Компания Tesla представила новые модели электромобилей...",
                        LocalDate.now().minusDays(1)),
                createNews(moderator, "Рост цен на автомобили в 2024 году",
                        "Эксперты прогнозируют рост цен на автомобили в 2024 году...",
                        LocalDate.now().minusDays(3)),
                createNews(moderator, "Новые правила регистрации автомобилей",
                        "С 1 января 2024 года вступают в силу новые правила регистрации...",
                        LocalDate.now().minusDays(5))
        );
        newsRepository.saveAll(newsList);
    }

    /**
     * Создает автомобиль с указанными параметрами.
     *
     * @param brand марка автомобиля
     * @param model модель автомобиля
     * @param year год выпуска
     * @param price цена автомобиля
     * @param description описание автомобиля
     * @param imageUrl URL изображения автомобиля
     * @param status статус автомобиля
     * @return созданный автомобиль
     */
    private Car createCar(String brand, String model, int year, double price,
                          String description, String imageUrl, CarStatus status) {
        Car car = new Car();
        car.setBrand(brand);
        car.setModel(model);
        car.setYear(year);
        car.setPrice(price);
        car.setDescription(description);
        car.setImageUrl(imageUrl);
        car.setStatus(status);
        return car;
    }

    /**
     * Создает новость с указанными параметрами.
     *
     * @param user автор новости
     * @param title заголовок новости
     * @param content содержание новости
     * @param date дата публикации
     * @return созданная новость
     */
    private News createNews(User user, String title, String content, LocalDate date) {
        News news = new News();
        news.setUser(user);
        news.setTitle(title);
        news.setContent(content);
        news.setDate(date);
        return news;
    }
}