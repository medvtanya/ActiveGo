class UserValidator {
  static validateMail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password) {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
    const isValidLength = password.length >= 8;

    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false;
    } else {
      return true;
    }
  }

  static validate({ email, password }) {
    if (
      !email ||
      !password ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      return {
        isValid: false,
        error: 'Создание пользователя с такими полями не доступно',
      };
    }

    if (!this.validateMail(email)) {
      return { isValid: false, error: 'Неподдерживаемый формат почты' };
    }
    if (!this.validatePassword(password)) {
      return {
        isValid: false,
        error:
          'Неподдерживаемый формат пароля. Должен быть сиввол, большая буква, маленькая, цифра и не менее 8 символов.',
      };
    }

    return { isValid: true, error: null };
  }

  static validatePhone(iphone) {
    const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phonePattern.test(iphone);
  }

  static validateFull({ firstName, lastName, email, password, cityId }) {
    if (!firstName || !lastName || !email || !password || !cityId) {
      return {
        isValid: false,
        error: 'Все обязательные поля должны быть заполнены',
      };
    }
    if (
      typeof firstName !== 'string' ||
      typeof lastName !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof cityId !== 'number'
    ) {
      return { isValid: false, error: 'Некорректные типы данных' };
    }
    if (
      firstName.trim().length === 0 ||
      lastName.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      return { isValid: false, error: 'Поля не должны быть пустыми' };
    }
    if (!this.validateMail(email)) {
      return { isValid: false, error: 'Неподдерживаемый формат почты' };
    }
    if (!this.validatePassword(password)) {
      return {
        isValid: false,
        error:
          'Неподдерживаемый формат пароля. Должен быть символ, большая буква, маленькая, цифра и не менее 8 символов.',
      };
    }
    return { isValid: true, error: null };
  }

  static validateTelegramRegistration({
    userName,
    cityId,
    firstName,
    lastName,
    iphone,
    telegram_id,
  }) {
    if (!telegram_id) {
      return {
        isValid: false,
        error: 'Telegram ID обязателен',
      };
    }
    if (typeof telegram_id !== 'string') {
      return { isValid: false, error: 'Некорректный тип telegram_id' };
    }
    if (telegram_id.trim().length === 0) {
      return { isValid: false, error: 'Telegram ID не должен быть пустым' };
    }

    // Проверяем userName только если он предоставлен
    if (userName !== undefined) {
      if (typeof userName !== 'string' || userName.trim().length === 0) {
        return {
          isValid: false,
          error: 'UserName не должен быть пустым, если указан',
        };
      }
    }

    // Проверяем firstName только если он предоставлен
    if (firstName !== undefined) {
      if (typeof firstName !== 'string' || firstName.trim().length === 0) {
        return {
          isValid: false,
          error: 'FirstName не должен быть пустым, если указан',
        };
      }
    }

    // Проверяем lastName только если он предоставлен
    if (lastName !== undefined) {
      if (typeof lastName !== 'string' || lastName.trim().length === 0) {
        return {
          isValid: false,
          error: 'Фамилия не должна быть пустой, если указана',
        };
      }
    }

    if (iphone !== undefined) {
      if (typeof iphone !== 'string' || iphone.trim().length === 0) {
        return {
          isValid: false,
          error: 'Телефон не должен быть пустым, если указан',
        };
      }
    }

    if (cityId !== undefined && typeof cityId !== 'number') {
      return { isValid: false, error: 'Некорректный тип cityId' };
    }
    return { isValid: true, error: null };
  }
}

module.exports = UserValidator;
