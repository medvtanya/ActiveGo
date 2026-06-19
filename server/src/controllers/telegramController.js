const crypto = require('crypto');
const UserService = require('../services/userService');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../config/cookieConfig');
const formatResponse = require('../utils/formatResponse');
const UserValidator = require('../utils/User.validator');

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

function checkTelegramAuth(data, botToken) {
  const secret = crypto.createHash('sha256').update(botToken).digest();

  const fields = Object.keys(data)
    .filter((k) => k !== 'hash')
    .sort();
  const dataCheckString = fields.map((k) => `${k}=${data[k]}`).join('\n');

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  if (hmac !== data.hash) return false;

  const now = Math.floor(Date.now() / 1000);
  const authDate = Number(data.auth_date);

  if (!authDate || now - authDate > 120) return false;

  return true;
}

class TelegramController {
  static async registerViaTelegram(req, res) {
    try {
      const telegramData = req.body;
      if (!checkTelegramAuth(telegramData, TELEGRAM_BOT_TOKEN)) {
        return res
          .status(401)
          .json(formatResponse(401, 'Ошибка проверки Telegram подписи'));
      }

      let user = await UserService.getByTelegramId(telegramData.id);
      if (user) {
        return res
          .status(409)
          .json(formatResponse(409, 'Пользователь уже зарегистрирован'));
      }

      // Проверяем username только если он предоставлен
      if (telegramData.username) {
        const existingUserByUsername = await UserService.getByUserName(
          telegramData.username
        );
        if (existingUserByUsername) {
          return res
            .status(409)
            .json(
              formatResponse(
                409,
                'Пользователь с таким username уже зарегистрирован'
              )
            );
        }
      }

      const userName = telegramData.username || undefined;
      const firstName = telegramData.first_name || undefined;
      const lastName = telegramData.last_name || undefined;
      const iphone = telegramData.iphone;
      const cityId = telegramData.cityId
        ? Number(telegramData.cityId)
        : undefined;
      const telegram_id = telegramData.id;
      const telegram_photo =
        telegramData.photo_url || '/images/default-avatar.png';

      const photo = telegram_photo || '/images/default-avatar.png';

      const { isValid, error } = UserValidator.validateTelegramRegistration({
        userName,
        cityId,
        firstName,
        lastName,
        iphone,
        telegram_id,
      });
      if (!isValid) {
        return res
          .status(400)
          .json(formatResponse(400, 'Валидация не прошла', error));
      }

      const userData = {
        iphone,
        cityId,
        telegram_id,
        telegram_photo,
        photo,
      };

      // Добавляем поля только если они не undefined
      if (userName !== undefined) userData.userName = userName;
      if (firstName !== undefined) userData.firstName = firstName;
      if (lastName !== undefined) userData.lastName = lastName;
      if (cityId !== undefined) userData.cityId = cityId;

      user = await UserService.registerUser(userData);

      const { accessToken, refreshToken } = generateTokens({ user });
      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(
            200,
            'Пользователь успешно зарегистрирован через Telegram',
            {
              accessToken,
              user,
            }
          )
        );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res
          .status(409)
          .json(
            formatResponse(
              409,
              'Пользователь с таким username уже зарегистрирован'
            )
          );
      }
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка Telegram регистрации', error.message)
        );
    }
  }

  static async loginViaTelegram(req, res) {
    try {
      const telegramData = req.body;
      console.log('TELEGRAM LOGIN BODY:', telegramData);
      if (!checkTelegramAuth(telegramData, TELEGRAM_BOT_TOKEN)) {
        return res
          .status(401)
          .json(formatResponse(401, 'Ошибка проверки Telegram подписи'));
      }

      console.log(
        'TELEGRAM LOGIN id:',
        telegramData.id,
        typeof telegramData.id
      );
      let user = await UserService.getByTelegramId(telegramData.id);
      if (!user) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              'Пользователь не найден. Сначала зарегистрируйтесь.'
            )
          );
      }

      const { accessToken, refreshToken } = generateTokens({ user });
      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(200, 'Успешный вход через Telegram', {
            accessToken,
            user,
          })
        );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Ошибка Telegram входа', error.message));
    }
  }
}

module.exports = TelegramController;
