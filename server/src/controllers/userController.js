const cookieConfig = require('../config/cookieConfig');
const UserService = require('../services/userService');
const formatResponse = require('../utils/formatResponse');
const generateTokens = require('../utils/generateTokens');
const path = require('path');
const fs = require('fs');

const passwordResetStore = {};
const PASSWORD_RESET_TTL = 10 * 60 * 1000;
const PASSWORD_RESET_ATTEMPTS = 5;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const axios = require('axios');
async function sendTelegramCode(telegramId, code) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const text = `Ваш код для восстановления пароля: ${code}`;
  await axios.post(url, { chat_id: telegramId, text });
}

class UserController {
  static async getAll(req, res) {
    try {
      const result = await UserService.getAllUsers();
      res.status(200).json(formatResponse(200, 'Все пользователи', result));
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .json(formatResponse(401, 'У тебя нет прав', error.message));
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getOneUser(id);

      if (!user) {
        return res
          .status(404)
          .json(formatResponse(404, 'Пользователь не найден', null));
      }

      user.hasPassword = !!user.password;
      delete user.password;
      res.status(200).json(formatResponse(200, 'Один пользователь', user));
    } catch (error) {
      console.log('UserController.getOne - ошибка:', error);
      res
        .status(500)
        .json(
          formatResponse(500, 'Не удалось получить пользователя', error.message)
        );
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      console.log('UserController.delete - id:', id);

      const user = await UserService.getOneUser(id);
      console.log(
        'UserController.delete - найденный пользователь:',
        user ? 'существует' : 'не найден'
      );

      if (!user) {
        console.log(
          'UserController.delete - пользователь не найден, очищаем токены'
        );
        return res
          .status(404)
          .clearCookie('refreshToken')
          .json(formatResponse(404, 'Пользователь не найден', null));
      }

      const result = await UserService.deleteUser(id);
      console.log('UserController.delete - result:', result);

      if (user.photo && !user.photo.includes('default')) {
        const photoPath = path.join(
          __dirname,
          '../../public/images',
          user.photo.replace('/images/', '')
        );
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
          console.log(
            'Удалено фото пользователя при удалении аккаунта:',
            user.photo
          );
        }
      }

      if (user.telegram_photo && !user.telegram_photo.includes('default')) {
        const telegramPhotoPath = path.join(
          __dirname,
          '../../public/images',
          user.telegram_photo.replace('/images/', '')
        );
        if (fs.existsSync(telegramPhotoPath)) {
          fs.unlinkSync(telegramPhotoPath);
          console.log(
            'Удалено telegram_photo пользователя при удалении аккаунта:',
            user.telegram_photo
          );
        }
      }

      res
        .status(200)
        .clearCookie('refreshToken')
        .json(formatResponse(200, 'Пользователь успешно удалён', result));
    } catch (error) {
      console.log('UserController.delete - ошибка:', error);

      // Handle specific foreign key constraint error
      if (error.message && error.message.includes('связанные записи')) {
        return res.status(400).json(formatResponse(400, error.message, null));
      }

      res
        .status(500)
        .clearCookie('refreshToken')
        .json(
          formatResponse(500, 'Не удалось удалить пользователя', error.message)
        );
    }
  }

  static async deactivate(req, res) {
    try {
      const { id } = req.params;
      console.log('UserController.deactivate - id:', id);

      const user = await UserService.getOneUser(id);
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(404, 'Пользователь не найден', null));
      }

      const result = await UserService.deactivateUser(id);
      console.log('UserController.deactivate - result:', result);

      res
        .status(200)
        .clearCookie('refreshToken')
        .json(
          formatResponse(200, 'Пользователь успешно деактивирован', result)
        );
    } catch (error) {
      console.log('UserController.deactivate - ошибка:', error);
      res
        .status(500)
        .clearCookie('refreshToken')
        .json(
          formatResponse(
            500,
            'Не удалось деактивировать пользователя',
            error.message
          )
        );
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      console.log('UserController.update - начало обработки:', {
        id,
        body: req.body,
        files: req.files ? Object.keys(req.files) : 'нет файлов',
        hasPhoto: req.files && req.files['photo'],
        hasTelegramPhoto: req.files && req.files['telegram_photo'],
      });

      const user = await UserService.getOneUser(id);
      const updateData = {};

      [
        'firstName',
        'lastName',
        'userName',
        'email',
        'birth',
        'content',
        'link',
        'cityId',
        'iphone',
      ].forEach((field) => {
        if (req.body[field] !== undefined) {
          if (typeof req.body[field] === 'string' && req.body[field] === '') {
            updateData[field] = null;
          } else {
            updateData[field] = req.body[field];
          }
        }
      });

      // Validate cityId if it's being updated
      if (updateData.cityId !== undefined) {
        console.log(
          'UserController.update - проверка cityId:',
          updateData.cityId
        );

        // Convert string to number if needed (FormData sends strings)
        let cityIdNum = updateData.cityId;
        if (typeof cityIdNum === 'string') {
          cityIdNum = Number(cityIdNum);
          console.log(
            'UserController.update - конвертировали строку в число:',
            {
              original: updateData.cityId,
              converted: cityIdNum,
            }
          );
        }

        // Validate that cityId is a positive number
        if (
          typeof cityIdNum !== 'number' ||
          isNaN(cityIdNum) ||
          cityIdNum <= 0
        ) {
          console.log('UserController.update - недопустимый cityId:', {
            requestedCityId: updateData.cityId,
            convertedCityId: cityIdNum,
            type: typeof cityIdNum,
          });
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                'Недопустимый ID города. ID должен быть положительным числом.',
                null
              )
            );
        }

        // Update the cityId to the converted number
        updateData.cityId = cityIdNum;

        const { City } = require('../db/models');
        const city = await City.findByPk(updateData.cityId);
        if (!city) {
          console.log(
            'UserController.update - город не найден в базе данных:',
            {
              requestedCityId: updateData.cityId,
              type: typeof updateData.cityId,
            }
          );
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                'Указанный город не существует в базе данных',
                null
              )
            );
        }
        console.log('UserController.update - город найден:', {
          cityId: city.id,
          cityName: city.city,
        });
      }

      // Проверка уникальности userName только если он передается и не пустой
      if (req.body.userName && req.body.userName.trim() !== '') {
        const existingUser = await UserService.getByUserName(req.body.userName);
        if (existingUser && existingUser.id !== parseInt(id)) {
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                'Пользователь с таким userName уже существует',
                null
              )
            );
        }
      }

      if (req.files && req.files['photo']) {
        console.log('UserController.update - обработка photo файла:', {
          filename: req.files['photo'][0].filename,
          originalname: req.files['photo'][0].originalname,
          size: req.files['photo'][0].size,
        });

        if (user.photo && !user.photo.includes('default')) {
          const oldPath = path.join(
            __dirname,
            '../../public/images',
            user.photo.replace('/images/', '')
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('Удалено старое фото пользователя:', user.photo);
          }
        }
        updateData.photo = `/images/${req.files['photo'][0].filename}`;
      }

      if (req.files && req.files['telegram_photo']) {
        console.log('UserController.update - обработка telegram_photo файла:', {
          filename: req.files['telegram_photo'][0].filename,
          originalname: req.files['telegram_photo'][0].originalname,
          size: req.files['telegram_photo'][0].size,
        });

        if (user.telegram_photo && !user.telegram_photo.includes('default')) {
          const oldPath = path.join(
            __dirname,
            '../../public/images',
            user.telegram_photo.replace('/images/', '')
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log(
              'Удалено старое telegram_photo пользователя:',
              user.telegram_photo
            );
          }
        }
        updateData.telegram_photo = `/images/${req.files['telegram_photo'][0].filename}`;
      }

      if (req.body.password) {
        if (user.password) {
          if (!req.body.oldPassword) {
            return res
              .status(400)
              .json(formatResponse(400, 'Требуется старый пароль', null));
          }
          const bcrypt = require('bcrypt');
          const isMatch = await bcrypt.compare(
            req.body.oldPassword,
            user.password
          );
          if (!isMatch) {
            return res
              .status(400)
              .json(formatResponse(400, 'Старый пароль неверен', null));
          }
        }
        updateData.password = req.body.password;
      }
      console.log('UserController.update - данные для обновления:', updateData);
      await UserService.updateUser(id, updateData);
      const newUser = await UserService.getOneUser(id);
      console.log('UserController.update - пользователь обновлен:', {
        id: newUser.id,
        photo: newUser.photo,
        telegram_photo: newUser.telegram_photo,
      });
      newUser.hasPassword = !!newUser.password;
      delete newUser.password;
      const { accessToken, refreshToken } = generateTokens({ user: newUser });
      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(200, 'Пользователь успешно обновлён', {
            accessToken,
            newUser,
          })
        );
    } catch (error) {
      console.log('UserController.update - ошибка:', error);
      res
        .status(500)
        .json(
          formatResponse(500, 'Не удалось обновить пользователя', error.message)
        );
    }
  }

  static async requestPasswordReset(req, res) {
    try {
      const { iphone } = req.body;
      if (!iphone)
        return res.status(400).json({ message: 'Не указан телефон' });
      const user = await UserService.getByPhone(iphone);
      if (!user)
        return res.status(404).json({ message: 'Пользователь не найден' });
      if (!user.telegram_id)
        return res
          .status(400)
          .json({ message: 'У пользователя не привязан Telegram' });
      const telegram_id = user.telegram_id;

      const now = Date.now();
      const store = passwordResetStore[telegram_id];
      if (
        store &&
        store.attempts >= PASSWORD_RESET_ATTEMPTS &&
        now - store.created < PASSWORD_RESET_TTL
      ) {
        return res
          .status(429)
          .json({ message: 'Превышено количество попыток. Попробуйте позже.' });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      passwordResetStore[telegram_id] = {
        code,
        created: now,
        attempts: store ? store.attempts + 1 : 1,
      };
      await sendTelegramCode(telegram_id, code);
      return res.json({ message: 'Код отправлен в Telegram', telegram_id });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка отправки кода', error: e.message });
    }
  }

  static async verifyPasswordReset(req, res) {
    try {
      const { telegram_id, code, password } = req.body;
      if (!telegram_id || !code || !password)
        return res.status(400).json({ message: 'Не все поля заполнены' });
      const store = passwordResetStore[telegram_id];
      if (!store || Date.now() - store.created > PASSWORD_RESET_TTL) {
        return res.status(400).json({ message: 'Код истёк или не найден' });
      }
      if (store.code !== code) {
        store.attempts++;
        if (store.attempts >= PASSWORD_RESET_ATTEMPTS)
          delete passwordResetStore[telegram_id];
        return res.status(400).json({ message: 'Неверный код' });
      }

      await UserService.updateUserByTelegramId(telegram_id, { password });
      delete passwordResetStore[telegram_id];
      return res.json({ message: 'Пароль успешно сброшен' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сброса пароля', error: e.message });
    }
  }
}

module.exports = UserController;
