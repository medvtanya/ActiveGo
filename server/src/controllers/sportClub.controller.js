const SportClubService = require("../services/sportClub.service");
const formatResponse = require("../utils/formatResponse");
const SportClubMemberesService = require("../services/sportClubMemberes.service");
const { getGlobalIo } = require("../config/websocketConfig");

class SportClubController {
  static async getAll(req, res) {
    try {
      const sportClubs = await SportClubService.getAll();

      if (sportClubs.length === 0) {
        return res
          .status(200)
          .json(formatResponse(200, "Спорт клубы не найдены", []));
      }
      return res
        .status(200)
        .json(
          formatResponse(200, "Данные по клубам успешно получены", sportClubs)
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubController.getAll=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    if (isNaN(id))
      return res
        .status(400)
        .json(formatResponse(400, "Невалидный ID", null, "Невалидный ID"));

    try {
      const sportClub = await SportClubService.getById(id);

      if (!sportClub)
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Спорт клуб не найден",
              null,
              "Спорт клуб не найден"
            )
          );

      return res
        .status(200)
        .json(
          formatResponse(200, "Данные по клубу успешно получены", sportClub)
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubController.getById=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }

  static async create(req, res) {
    try {
      const { sportId, title, openCommunity, cityId, content, ownerId } =
        req.body;
      const photo = req.file ? req.file.filename : null;
      const result = await SportClubService.createSportClub({
        sport_id: Number(sportId),
        title,
        openCommunity: openCommunity === true || openCommunity === "true",
        city_id: Number(cityId),
        owner_id: Number(ownerId),
        content,
        photo,
      });

      await SportClubMemberesService.create({
        sportClub_id: result.id,
        user_id: Number(ownerId),
        access: true,
      });
      res
        .status(201)
        .json(formatResponse(201, "Клуб успешно создан", result, null));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Не удалось создать клуб", null, error.message)
        );
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    console.log("=== updateById controller called with id:", id);
    console.log("=== req.body:", req.body);
    console.log("=== req.file:", req.file);

    if (isNaN(id))
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Невалидный ID клуба",
            null,
            "Невалидный ID клуба"
          )
        );

    const existingClub = await SportClubService.getById(id);
    if (!existingClub) {
      return res
        .status(404)
        .json(formatResponse(404, "Клуб не найден", null, "Клуб не найден"));
    }

    try {
      const updatedSportClub = await SportClubService.updateById(id, {
        ...req.body,
        photo: req.file ? req.file.filename : req.body.photo,
      });

      console.log("=== updatedSportClub result:", updatedSportClub);

      if (!updatedSportClub)
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не удалось обновить клуб",
              null,
              "Не удалось обновить клуб"
            )
          );

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            "Данные по клубу успешно обновлены",
            updatedSportClub
          )
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubController.updateById=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;
    console.log("=== deleteById controller called with id:", id);

    if (isNaN(id))
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Невалидный ID клуба",
            null,
            "Невалидный ID клуба"
          )
        );

    try {
      const existingClub = await SportClubService.getById(id);
      console.log("=== existingClub check:", existingClub);

      if (!existingClub) {
        return res
          .status(404)
          .json(formatResponse(404, "Клуб не найден", null, "Клуб не найден"));
      }

      const deletedSportClub = await SportClubService.deleteById(id);
      console.log("=== deletedSportClub result:", deletedSportClub);

      if (!deletedSportClub)
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не удалось удалить клуб",
              null,
              "Не удалось удалить клуб"
            )
          );

      const io = getGlobalIo();
      if (io) {
        const roomId = `chat-${id}`;
        io.to(roomId).emit("club-deleted", {
          message: "Клуб был удален создателем",
          redirectTo: "/",
        });
      }

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            "Данные по клубу успешно удалены",
            deletedSportClub
          )
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubController.deleteById=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }
}

module.exports = SportClubController;
