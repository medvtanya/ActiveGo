const { Chat, User } = require('../db/models');

class ChatService {
  static async getMessagesInChat(count, sportClubId) {
    const limit = Math.min(count, 100);
    const where = {};

    if (sportClubId) {
      where.sportClubId = sportClubId;
    } else {
      throw new Error('sportClubId обязателен для получения сообщений');
    }

    const result = await Chat.findAll({
      where,
      limit,
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,

          as: "user",
          attributes: ["id", "firstName", "lastName", "userName", "telegram_photo"]
        }
      ]

    });
    return result;
  }

  static async addMessageToChat(data) {
    try {
      if (!data.userId || !data.message || !data.sportClubId) {
        throw new Error('userId, message и sportClubId обязательны');
      }

      // data: { userId, message, sportClubId }
      const chat = await Chat.create(data);
      return Chat.findByPk(chat.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'userName'],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteMessageFromChat(id) {
    try {
      const deletedMessage = await Chat.destroy({ where: { id } });
      if (!deletedMessage) {
        throw new Error('Message not found');
      }
      return id;
    } catch (error) {
      throw error;
    }
  }

  static async updateMessageInChat(id, data) {
    try {
      if (!data.message) {
        throw new Error('message обязателен для обновления');
      }

      // data: { message, sportClubId }
      await Chat.update(data, { where: { id } });
      return Chat.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'userName'],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChatService;

// const { Chat } = require("../db/models");

// class ChatServise {
//     static async createChat(userId, sportClubId, message) {
//         const chat = await Chat.create({ userId, sportClubId, message });
//         return chat;
//     }

//     static async getChatsBySportClubId(sportClubId) {
//         const chats = await Chat.findAll({ where: { sportClubId } });
//         return chats;
//     }

//     static async getChatsByUserId(userId) {
//         const chats = await Chat.findAll({ where: { userId } });
//         return chats;
//     }

//     static async getChatsBySportClubIdAndUserId(sportClubId, userId) {
//         const chats = await Chat.findAll({ where: { sportClubId, userId } });
//         return chats;
//     }

//     static async deleteChatMessage(chatId) {
//         const chat = await Chat.destroy({ where: { id: chatId } });
//         return chat;
//     }

// }

// module.exports = ChatServise
