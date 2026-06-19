const ChatService = require("../services/chatServise");
const formatResponse = require("../utils/formatResponse");

class ChatController {
  static async getMessagesChat(req, res) {
    const countMessage = req.query.count ? Number(req.query.count) : 50;
    const sportClubId = req.query.sportClubId
      ? Number(req.query.sportClubId)
      : undefined;
    console.log("CONTROLLER ========", sportClubId);
    console.log("CONTROLLER ========", countMessage);

    try {
      // Валидация sportClubId
      if (!sportClubId) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "sportClubId обязателен для получения сообщений чата"
            )
          );
      }

      const messages = await ChatService.getMessagesInChat(
        countMessage,
        sportClubId
      );

      res.status(200).json(formatResponse(200, "Получены сообщения", messages));
    } catch (error) {
      console.error("Ошибка в getMessagesChat:", error);
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", error.message));
    }
  }

  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(formatResponse(400, "Файл не был загружен"));
      }

      const { sportClubId, userId } = req.body;

      if (!sportClubId || !userId) {
        return res
          .status(400)
          .json(formatResponse(400, "sportClubId и userId обязательны"));
      }

      // Создаем путь к изображению
      const imageUrl = `/images/${req.file.filename}`;

      // Сохраняем сообщение с изображением в БД
      const messageData = {
        message: `[IMAGE]${imageUrl}`,
        userId: Number(userId),
        sportClubId: Number(sportClubId),
      };

      const savedMessage = await ChatService.addMessageToChat(messageData);

      res.status(200).json(
        formatResponse(200, "Изображение успешно загружено", {
          imageUrl: imageUrl,
          messageId: savedMessage.id,
        })
      );
    } catch (error) {
      console.error("Ошибка в uploadImage:", error);
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", error.message));
    }
  }
}

module.exports = ChatController;

// const ChatServise = require("../services/chatServise");
// const formatResponse = require("../utils/formatResponse");

// class ChatController {
//     static async getAll(req, res) {
//         try {
//             const result = await ChatServise.getAllChats();
//             return res
//                 .status(200)
//                 .json(formatResponse(200, "Все чаты успешно получены", result));
//         } catch (error) {
//             return res
//                 .status(500)
//                 .json(formatResponse(500, "Внутренняя ошибка сервера", error.error));
//         }

//     }

//     static async getOne(req, res) {
//         try {
//             const { id } = req.params;
//             const result = await ChatServise.getOneChat(id)
//             return res
//             .status(200)
//             .json(formatResponse(200, "Одна категории успешно получена", result))
//         } catch (error) {
//             return res
//             .status(500)
//             .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
//         }
//     }

//     static async create(req, res) {
//         try {
//             const { name } = req.body;
//             const result = await ChatServise.createChat(name)
//             return res
//             .status(200)
//             .json(formatResponse(200, "Успешно создана новая категория", result))
//         } catch (error) {
//             return res
//             .status(500)
//             .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
//         }
//     }

//     static async delete(req, res) {
//         try {
//             const { id } = req.params;
//             const result = await ChatServise.deleteChat(id)
//             return res
//             .status(200)
//             .json(formatResponse(200, "Категория успешно удалена", result))
//         } catch (error) {
//             return res
//             .status(500)
//             .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
//         }
//     }

//     static async update(req, res) {
//         try {
//             const { id } = req.params;
//             const { name } = req.body;
//             const result = await ChatServise.updateChat(id, name)
//             return res
//             .status(200)
//             .json(formatResponse(200, "Категория успешно обновлена", result))
//         } catch (error) {
//             return res
//             .status(500)
//             .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
//         }
//     }

// }

// module.exports = ChatController
