const ComplaintService = require("../services/complaintService");
const formatResponse = require("../utils/formatResponse");

class ComplaintController {
  static async getAll(req, res) {
    try {
      const result = await ComplaintService.getAllComplaints();
      res.status(200).json(formatResponse(200, "Все жалобы", result, null));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось получить все жалобы. Ошибка Сервера",
            null,
            error.message
          )
        );
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const result = await ComplaintService.getOneComplaint(id);
      res
        .status(200)
        .json(formatResponse(200, "Получена одна жалоба", result, null));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось получить одну жалобу. Ошибка Сервера",
            null,
            error.message
          )
        );
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ComplaintService.deleteComplaint(id);
      res
        .status(200)
        .json(formatResponse(200, "Жалоба успешно удалена", result, null));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось удалить жалобу. Ошибка сервера",
            null,
            error.message
          )
        );
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { userId, eventId, content, type_Of_complaint } = req.body;
      const result = await ComplaintService.updateComplaint(id, {
        userId,
        eventId,
        content,
        type_Of_complaint,
      });
      res
        .status(200)
        .json(formatResponse(200, "Жалоба успешно обновлена", result, null));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Не удалось обновить жалобу", null, error.message)
        );
    }
  }

  static async create(req, res) {
    try {
      const { userId, eventId, content, type_Of_complaint } = req.body;
      const result = await ComplaintService.createComplaint({
        userId,
        eventId,
        content,
        type_Of_complaint,
      });
      res
        .status(200)
        .json(formatResponse(200, "Жалоба успешно создана", result, null));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Не удалось создать жалобу", null, error.message)
        );
    }
  }
}

module.exports = ComplaintController;
