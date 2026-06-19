const bcrypt = require('bcrypt');
const UserService = require('../services/userService');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../config/cookieConfig');
const formatResponse = require('../utils/formatResponse');
const UserValidator = require('../utils/User.validator');

class AuthController {
  static async register(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        iphone,
        cityId,
        isAdmin,
        photo,
        telegram_photo,
      } = req.body;

      const { isValid, error } = UserValidator.validateFull({
        firstName,
        lastName,
        email,
        password,
        iphone,
        cityId: Number(cityId),
      });

      if (!isValid) {
        return res
          .status(400)
          .json(formatResponse(400, 'Валидация не прошла', error));
      }

      const normalizedEmail = email.toLowerCase();
      const userFound = await UserService.getByEmail(normalizedEmail);
      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с такой почтой уже зарегистрирован',
              'Пользователь с такой почтой уже зарегистрирован'
            )
          );
      }

      const user = await UserService.registerUser({
        firstName,
        lastName,
        email: normalizedEmail,
        password,
        iphone,
        cityId: Number(cityId),
        isAdmin: isAdmin === true || isAdmin === 'true',
        photo: photo || '/images/default-avatar.png',
        telegram_photo: telegram_photo || '/images/default-avatar.png',
      });

      user.hasPassword = !!user.password;
      delete user.password;
      const { accessToken, refreshToken } = generateTokens({ user });
      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(200, 'Пользователь успешно зарегистрирован', {
            accessToken,
            user,
          })
        );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(500, 'Не удалось создать пользователя', error.message)
        );
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      console.log('authController.login - попытка входа:', {
        email: normalizedEmail,
        hasPassword: !!password,
        passwordLength: password?.length,
      });

      const user = await UserService.getByEmail(normalizedEmail);

      if (!user) {
        console.log('authController.login - пользователь не найден');
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с такой почтой не найден',
              'Пользователь с такой почтой не найден'
            )
          );
      }

      console.log('authController.login - пользователь найден:', {
        id: user.id,
        userName: user.userName,
        isAdmin: user.isAdmin,
        hasPassword: !!user.password,
      });

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log('authController.login - неверный пароль');
        return res
          .status(400)
          .json(formatResponse(400, 'Неверный пароль', 'Неверный пароль'));
      }

      console.log('authController.login - пароль верный, создаем токены');

      user.hasPassword = !!user.password;
      delete user.password;

      const { accessToken, refreshToken } = generateTokens({ user });

      console.log('authController.login - токены созданы, отправляем ответ');

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(200, 'Пользователь успешно авторизован', {
            accessToken,
            user,
          })
        );
    } catch (error) {
      console.log('authController.login - ошибка:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Не удалось войти', error.message));
    }
  }

  static async logout(req, res) {
    try {
      res
        .status(200)
        .clearCookie('refreshToken', cookieConfig.refresh)
        .json(formatResponse(200, 'Успешный выход'));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Не удалось выйти', error.message));
    }
  }

  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      if (user.hasPassword === undefined) {
        user.hasPassword = !!user.password;
      }

      const { accessToken, refreshToken } = generateTokens({ user });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(200, 'Перевыпуск токенов успешен!', {
            accessToken,
            user,
          })
        );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Не удалось получить токены', error.message));
    }
  }
}

module.exports = AuthController;
