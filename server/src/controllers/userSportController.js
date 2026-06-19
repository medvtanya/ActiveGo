const UserSportService = require('../services/userSportService');
const formatResponse = require('../utils/formatResponse');

class UserSportController {
  static async getAll(req, res) {
    try {
      const result = await UserSportService.getAllUserSport();
      return res
        .status(200)
        .json(formatResponse(200, 'Все категории успешно получены', result));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', error.error));
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const result = await UserSportService.getOneUserSport(id);
      return res
        .status(200)
        .json(formatResponse(200, 'Одна категории успешно получена', result));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', error.error));
    }
  }

  static async create(req, res) {
    try {
      const { userId, sportId } = req.body;
      const result = await UserSportService.createUserSport(userId, sportId);
      return res
        .status(200)
        .json(formatResponse(200, 'Успешно создана новая категория', result));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', error.error));
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      console.log(`Попытка удаления связи пользователь-спорт с ID: ${id}`);

      const result = await UserSportService.deleteUserSport(id);
      console.log(`Связь пользователь-спорт с ID ${id} успешно удалена`);

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            'Связь пользователь-спорт успешно удалена',
            result
          )
        );
    } catch (error) {
      console.error('Ошибка при удалении userSport:', error);
      const errorMessage = error.message || 'Неизвестная ошибка сервера';
      return res.status(500).json(formatResponse(500, errorMessage, null));
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { userId, sportId } = req.body;
      const result = await UserSportService.updateUserSport(
        id,
        userId,
        sportId
      );
      return res
        .status(200)
        .json(formatResponse(200, 'Категория успешно обновлена', result));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', error.error));
    }
  }
}

module.exports = UserSportController;
