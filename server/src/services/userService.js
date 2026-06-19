const { User } = require('../db/models');
const { City } = require('../db/models');

class UserService {
  static async getAllUsers() {
    const users = await User.findAll();
    const result = users.map((el) => el.get({ plain: true }));
    return result;
  }

  static async getOneUser(id) {
    const user = await User.findByPk(id, {
      include: [{ model: City, as: 'city' }],
    });
    if (!user) {
      return null;
    }
    const result = user.get({ plain: true });
    return result;
  }

  static async getByTelegramId(telegram_id) {
    const user = await User.findOne({
      where: { telegram_id: String(telegram_id) },
    });
    if (!user) return null;
    return user.get({ plain: true });
  }

  static async registerUser(userData) {
    const user = await User.create(userData);
    return user.get({ plain: true });
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    try {
     
      await user.destroy({ force: true });
      return id;
    } catch (error) {
   
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        console.log('UserService.deleteUser - обнаружены связанные записи:', error.message);
        
      
        const { Complaint, UserSport, SportClubMemberes, SportClub, Event } = require('../db/models');
        
        const complaints = await Complaint.count({ where: { userId: id } });
        const userSports = await UserSport.count({ where: { userId: id } });
        const clubMemberships = await SportClubMemberes.count({ where: { user_id: id } });
        const ownedClubs = await SportClub.count({ where: { owner_id: id } });
        const events = await Event.count({ where: { userId: id } });
        
        console.log('UserService.deleteUser - связанные записи:', {
          complaints,
          userSports,
          clubMemberships,
          ownedClubs,
          events
        });
        
        throw new Error(
          `Невозможно удалить пользователя. У пользователя есть связанные записи: ` +
          `${complaints} жалоб, ${userSports} видов спорта, ${clubMemberships} членств в клубах, ` +
          `${ownedClubs} владеемых клубов, ${events} событий. ` +
          `Сначала удалите все связанные записи.`
        );
      }
      
      throw error;
    }
  }

  static async deactivateUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

  
    const updateData = {
      email: null,
      password: null,
      iphone: null,
      telegram_id: null,
      telegram_photo: null,
      photo: '/images/default-avatar.png',
      isAdmin: false,

    };

    await User.update(updateData, { where: { id } });
    return id;
  }

  static async updateUser(id, data) {
    console.log('UserService.updateUser - начало обновления:', { id, data });
    try {
      const [affectedRows] = await User.update(data, {
        where: { id },
        individualHooks: true,
      });
      console.log('UserService.updateUser - результат обновления:', {
        affectedRows,
      });
      if (affectedRows === 0) return null;
      const updatedUser = await User.findByPk(id);
      const result = updatedUser.get({ plain: true });
      console.log('UserService.updateUser - пользователь обновлен:', {
        id: result.id,
        photo: result.photo,
        telegram_photo: result.telegram_photo,
      });
      return result;
    } catch (error) {
      console.log('UserService.updateUser - ошибка:', error);
      throw error;
    }
  }

  static async updateUserByTelegramId(telegram_id, data) {
    const [affectedRows] = await User.update(data, {
      where: { telegram_id: String(telegram_id) },
      individualHooks: true,
    });
    if (affectedRows === 0) return null;
    const updatedUser = await User.findOne({
      where: { telegram_id: String(telegram_id) },
    });
    return updatedUser.get({ plain: true });
  }

  static async getByEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const result = user.get({ plain: true });
    return result;
  }

  static async getByUserName(userName) {
    const user = await User.findOne({ where: { userName } });
    if (!user) return null;
    return user.get({ plain: true });
  }

  static async getByPhone(iphone) {
    const user = await User.findOne({ where: { iphone } });
    if (!user) return null;
    return user.get({ plain: true });
  }
}

module.exports = UserService;
