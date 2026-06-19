const { SportClub, Sport } = require("../db/models");
const { City } = require("../db/models");
const { User } = require("../db/models");
const { SportClubMemberes } = require("../db/models");
const { Chat } = require("../db/models");
const fs = require("fs");
const path = require("path");

class SportClubService {
  static async getAll() {
    return await SportClub.findAll({
      include: [
        {
          model: Sport,
          as: "sport",
          attributes: ["id", "type"],
        },
        {
          model: City,
          as: "city",
          attributes: ["id", "city"],
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "userName"],
        },
      ],
    });
  }

  static async getById(id) {
    const result = await SportClub.findByPk(id, {
      include: [
        {
          model: Sport,
          as: "sport",
          attributes: ["id", "type"],
        },
        {
          model: City,
          as: "city",
          attributes: ["id", "city"],
        },
        {
          model: User,
          as: "owner",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "userName",
            "email",
            "iphone",
          ],
        },
      ],
    });
    return result;
  }

  static async createSportClub(data) {
    console.log("===========wwwww======+>>", data);
    return await SportClub.create(data);
  }

  static async updateById(id, data) {
    const sportClubForUpdate = await this.getById(id);

    if (!sportClubForUpdate) {
      return { error: "Спорт клуб не найден" };
    }

    const {
      title,
      sport_id,
      openCommunity,
      city_id,
      owner_id,
      photo,
      content,
    } = data;

    if (title) sportClubForUpdate.title = title;
    if (sport_id) sportClubForUpdate.sport_id = sport_id;
    if (openCommunity) sportClubForUpdate.openCommunity = openCommunity;
    if (city_id) sportClubForUpdate.city_id = city_id;
    if (owner_id) sportClubForUpdate.owner_id = owner_id;
    if (photo) sportClubForUpdate.photo = photo;
    if (content) sportClubForUpdate.content = content;

    await sportClubForUpdate.save();
    return sportClubForUpdate;
  }

  static async deleteById(id) {
    console.log("=== deleteById called with id:", id);

    const sportClubForDestroy = await this.getById(id);
    console.log("=== sportClubForDestroy:", sportClubForDestroy);

    if (!sportClubForDestroy) {
      console.log("=== sportClub not found, returning null");
      return null;
    }

    try {
      await SportClubMemberes.destroy({
        where: { sportClub_id: id },
      });
      console.log("=== members deleted successfully");
    } catch (error) {
      console.log("=== error deleting members:", error.message);
    }

    try {
      await Chat.destroy({
        where: { sportClubId: id },
      });
      console.log("=== chats deleted successfully");
    } catch (error) {
      console.log("=== error deleting chats:", error.message);
    }

    if (sportClubForDestroy.photo) {
      try {
        const filePath = path.join(
          __dirname,
          "../../public/images",
          sportClubForDestroy.photo
        );
        console.log("=== trying to delete file:", filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("=== file deleted successfully");
        } else {
          console.log("=== file does not exist, skipping");
        }
      } catch (error) {
        console.log("Ошибка при удалении файла:", error.message);
      }
    }

    try {
      const result = await sportClubForDestroy.destroy();
      console.log("=== destroy result:", result);
      return result;
    } catch (error) {
      console.log("=== error during destroy:", error.message);
      throw error;
    }
  }
}

module.exports = SportClubService;
