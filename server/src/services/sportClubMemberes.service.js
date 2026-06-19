const { SportClubMemberes, SportClub, User } = require("../db/models");

class SportClubMemberesService {
  static async getAll() {
    return await SportClubMemberes.findAll({
      include: [
        {
          model: SportClub,
          as: "sportClub",
          attributes: ["id", "title"],
        },
        {
          model: User,
          as: "user",

          attributes: ["id", "userName", "firstName", "lastName", "telegram_photo"],

        },
      ],
    });
  }

  static async getById(id) {
    return await SportClubMemberes.findByPk(id, {
      include: [
        {
          model: SportClub,
          as: "sportClub",
          attributes: ["id", "title"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "userName", "firstName", "lastName", "telegram_photo"],
        },
      ],
    });
  }

  static async create(data) {

    const memberData = {
      ...data,
      access: typeof data.access === "boolean" ? data.access : false,
    };
    return await SportClubMemberes.create(memberData);
  }

  static async updateById(id, data) {
    const sportClubMemberesForUpdate = await this.getById(id);

    if (!sportClubMemberesForUpdate) {
      return { error: "Спорт клуб не найден" };
    }

    const { sportClub_id, user_id, access } = data;

    if (sportClub_id) sportClubMemberesForUpdate.sportClub_id = sportClub_id;
    if (user_id) sportClubMemberesForUpdate.user_id = user_id;
    if (access !== undefined) sportClubMemberesForUpdate.access = access;

    await sportClubMemberesForUpdate.save();
    return sportClubMemberesForUpdate;
  }

  static async deleteById(id) {
    const sportClubMemberesForDestroy = await this.getById(id);

    if (!sportClubMemberesForDestroy) return null;

    return await sportClubMemberesForDestroy.destroy();
  }
}

module.exports = SportClubMemberesService;
