const { UserSport } = require('../db/models');
const { User } = require('../db/models');
const { Sport } = require('../db/models');

class UserSportService {
  static async getAllUserSport() {
    const usersSport = await UserSport.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Sport, as: 'sport' },
      ],
    });
    const result = usersSport.map((el) => el.get({ plain: true }));
    return result;
  }

  static async getOneUserSport(id) {
    const userSport = await UserSport.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Sport, as: 'sport' },
      ],
    });
    const result = userSport.get({ plain: true });
    return result;
  }

  static async createUserSport(userId, sportId) {
    const userSport = await UserSport.create({ userId, sportId });
    return userSport.get({ plain: true });
  }

  static async deleteUserSport(id) {
    const userSport = await UserSport.findByPk(id);
    if (!userSport) {
      throw new Error('Связь пользователь-спорт не найдена');
    }

    
    await userSport.destroy();
    console.log(`Удалена связь пользователь-спорт с ID: ${id}`);
    return id;
  }

  static async updateUserSport(id, userId, sportId) {
    try {
      const userSport = await UserSport.findByPk(id);
      if (!userSport) throw new Error('Спорт не найден');

      return await userSport.update({ userId, sportId });
    } catch (error) {
      throw new Error(`Ошибка обновления: ${error.message}`);
    }
  }
}

module.exports = UserSportService;
