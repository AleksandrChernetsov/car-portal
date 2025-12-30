package com.carportal.utils.validation;

import com.carportal.dto.request.UserCreateDTO;
import com.carportal.exception.ValidateException;

/**
 * Утилитный класс для валидации параметров пользователя.
 * Содержит методы для проверки корректности данных пользователя.
 */
public abstract class UserParamsValidator {

    private static final String USERNAME_REGEX = "^[a-zA-Z0-9_]{3,20}$";
    private static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    private static final String PHONE_REGEX = "^\\+?[0-9\\s\\-()]{7,20}$";
    private static final String RUSSIAN_PHONE_REGEX = "^\\+7\\s?\\(?\\d{3}\\)?\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}$";

    /**
     * Валидирует имя пользователя.
     *
     * @param username имя пользователя
     */
    public static void usernameValidate(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new ValidateException("Имя пользователя не может быть пустым");
        }
        if (!username.matches(USERNAME_REGEX)) {
            throw new ValidateException("Имя пользователя должно содержать только буквы, цифры и символ подчеркивания, и быть длиной от 3 до 20 символов");
        }
    }

    /**
     * Валидирует email пользователя.
     *
     * @param email email пользователя
     */
    public static void emailValidate(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new ValidateException("Email не может быть пустым");
        }
        if (!email.matches(EMAIL_REGEX)) {
            throw new ValidateException("Неправильный формат email адреса");
        }
    }

    /**
     * Валидирует пароль пользователя.
     *
     * @param password пароль пользователя
     */
    public static void passwordValidate(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new ValidateException("Пароль не может быть пустым");
        }
        if (password.length() < 6) {
            throw new ValidateException("Пароль должен содержать не менее 6 символов");
        }
        if (password.length() > 100) {
            throw new ValidateException("Пароль не может превышать 100 символов");
        }
    }

    /**
     * Валидирует телефон пользователя.
     * Разрешает null и пустые строки, так как поле необязательное.
     *
     * @param phone телефон пользователя
     */
    public static void phoneValidate(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return;
        }

        if (!phone.matches(PHONE_REGEX)) {
            throw new ValidateException("Неправильный формат номера телефона. Допустимы цифры, пробелы, дефисы и скобки");
        }

        String cleanPhone = phone.replaceAll("[\\s\\-()]", "");
        if (cleanPhone.startsWith("+7")) {
            if (cleanPhone.length() != 12) {
                throw new ValidateException("Российский номер телефона должен содержать 11 цифр после +7");
            }
        } else if (cleanPhone.startsWith("7") || cleanPhone.startsWith("8")) {
            if (cleanPhone.length() != 11) {
                throw new ValidateException("Российский номер телефона должен содержать 11 цифр");
            }
        } else if (cleanPhone.startsWith("9") && cleanPhone.length() == 10) {
        } else {
            if (cleanPhone.length() < 7) {
                throw new ValidateException("Номер телефона слишком короткий");
            }
            if (cleanPhone.length() > 15) {
                throw new ValidateException("Номер телефона слишком длинный");
            }
        }
    }

    /**
     * Валидирует все параметры пользователя из UserCreateDTO.
     *
     * @param userCreateDTO DTO с данными для создания пользователя
     */
    public static void userParamsValidate(UserCreateDTO userCreateDTO) {
        usernameValidate(userCreateDTO.getUsername());
        emailValidate(userCreateDTO.getEmail());
        passwordValidate(userCreateDTO.getPassword());
        if (userCreateDTO.getPhone() != null && !userCreateDTO.getPhone().trim().isEmpty()) {
            phoneValidate(userCreateDTO.getPhone());
        }
    }

    /**
     * Валидирует все параметры пользователя из UserEditDTO.
     *
     * @param userEditDTO DTO с данными для редактирования пользователя
     */
    public static void userEditParamsValidate(com.carportal.dto.request.UserEditDTO userEditDTO) {
        if (userEditDTO.getUsername() != null && !userEditDTO.getUsername().isEmpty()) {
            usernameValidate(userEditDTO.getUsername());
        }
        if (userEditDTO.getEmail() != null && !userEditDTO.getEmail().isEmpty()) {
            emailValidate(userEditDTO.getEmail());
        }
        if (userEditDTO.getPassword() != null && !userEditDTO.getPassword().isEmpty()) {
            passwordValidate(userEditDTO.getPassword());
        }
        if (userEditDTO.getPhone() != null && !userEditDTO.getPhone().trim().isEmpty()) {
            phoneValidate(userEditDTO.getPhone());
        }
    }
}