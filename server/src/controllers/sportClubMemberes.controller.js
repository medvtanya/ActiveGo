const SportClubMemberesService = require("../services/sportClubMemberes.service");
const formatResponse = require("../utils/formatResponse");
const { SportClubMemberes } = require("../db/models");

class SportClubMemberesController {
  static async getAll(req, res) {
    try {
      const sportClubMemberes = await SportClubMemberesService.getAll();

      if (sportClubMemberes.length === 0) {
        return res
          .status(200)
          .json(formatResponse(200, "Спорт клубы не найдены", []));
      }
      return res
        .status(200)
        .json(
          formatResponse(
            200,
            "Данные по клубам успешно получены",
            sportClubMemberes
          )
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubMemberesController.getAll=============",
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
      const sportClubMemberes = await SportClubMemberesService.getById(id);

      if (!sportClubMemberes)
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
          formatResponse(
            200,
            "Данные по клубу успешно получены",
            sportClubMemberes
          )
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubMemberesController.getById=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }

  static async create(req, res) {
    const { isValid, error } = SportClubMemberes.validate(req.body);

    if (!isValid)
      return res.status(400).json(formatResponse(400, error, null, error));

    try {
      const newSportClubMemberes = await SportClubMemberesService.create(
        req.body
      );

      if (!newSportClubMemberes)
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не удалось создать клуб",
              null,
              "Не удалось создать клуб"
            )
          );

      return res
        .status(201)
        .json(
          formatResponse(201, "Успешно создан новый клуб", newSportClubMemberes)
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubMemberesController.create=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;

    if (isNaN(id))
      return res
        .status(400)
        .json(formatResponse(400, "Невалидный ID", null, "Невалидный ID"));

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json(
          formatResponse(400, "Данные не пришли", null, "Данные не пришли")
        );
    }

    const { isValid, error } = SportClubMemberes.validate(req.body, true);

    if (!isValid)
      return res.status(400).json(formatResponse(400, error, null, error));

    try {
      const updatedSportClubMemberes =
        await SportClubMemberesService.updateById(id, req.body);

      if (!updatedSportClubMemberes)
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не удалось обновить участника клуба",
              null,
              "Не удалось обновить участника клуба"
            )
          );

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            "Участник клуба успешно обновлен",
            updatedSportClubMemberes
          )
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubMemberesController.updateById=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    if (isNaN(id))
      return res
        .status(400)
        .json(formatResponse(400, "Невалидный ID", null, "Невалидный ID"));

    try {
      const deletedSportClubMemberes =
        await SportClubMemberesService.deleteById(id);

      if (!deletedSportClubMemberes)
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

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            "Данные по клубу успешно удалены",
            deletedSportClubMemberes
          )
        );
    } catch ({ message }) {
      console.log(
        "=============SportClubMemberesController.deleteById=============",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }
}

module.exports = SportClubMemberesController;
