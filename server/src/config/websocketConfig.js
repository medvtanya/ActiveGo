const { Server } = require("socket.io");
const socketAuth = require("../middleware/socketAuth");
const ChatService = require("../services/chatServise");

let globalIo = null;

function setupWebsockets(server) {
  // Настройка CORS для WebSockets
  const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  };

  // Инициализация Socket.IO с настройками CORS
  const io = new Server(server, {
    cors: corsOptions,
  });

  globalIo = io;

  // Применяем middleware аутентификации ко всем соединениям
  io.use(socketAuth);

  // Хранение информации о подключенных пользователях по комнатам
  const connectedUsers = new Map(); // roomId -> Set of socketIds

  // WebSocket события
  io.on("connection", (socket) => {
    console.log(
      `Новое подключение: ${socket.id} от пользователя ${socket.user.userName}`
    );

    // Присоединение к комнате чата
    socket.on("join-chat-room", async (sportClubId) => {
      try {
        const roomId = `chat-${sportClubId}`;
        console.log(roomId);

        // Присоединяемся к комнате
        socket.join(roomId);

        // Сохраняем информацию о пользователе в комнате
        if (!connectedUsers.has(roomId)) {
          connectedUsers.set(roomId, new Set());
        }
        connectedUsers.get(roomId).add(socket.id);

        // Сохраняем информацию о комнате в socket
        socket.currentRoom = roomId;
        socket.sportClubId = sportClubId;

        console.log(
          `Пользователь ${socket.user.userName} присоединился к комнате ${roomId}`
        );

        // Уведомляем других пользователей в комнате
        socket.to(roomId).emit("user-joined-chat", {
          userId: socket.userId,
          userName: socket.user.userName,
          timestamp: new Date(),
        });

        // Отправляем информацию о подключенных пользователях
        const roomUsers = Array.from(connectedUsers.get(roomId)).map(
          (socketId) => {
            const userSocket = io.sockets.sockets.get(socketId);
            return {
              userId: userSocket.userId,
              userName: userSocket.user.userName,
            };
          }
        );

        socket.emit("chat-room-users", roomUsers);
      } catch (error) {
        console.error("Ошибка при присоединении к комнате:", error);
        socket.emit("error", { message: "Ошибка при присоединении к чату" });
      }
    });

    // Отправка нового сообщения
    socket.on("NEW_MESSAGE", async (data) => {
      console.log("DDDDDAAAATTTTTAAA", data);

      try {
        // if (!socket.currentRoom || !socket.sportClubId) {
        if (!data.sportClubId) {
          console.log("==================");
          console.log(socket.currentRoom);
          console.log(socket.sportClubId);

          socket.emit("error", { message: "Не присоединены к чату" });
          return;
        }

        const { message } = data;

        if (!message || typeof message !== "string" || message.trim() === "") {
          socket.emit("error", { message: "Сообщение не может быть пустым" });
          return;
        }

        const chatData = {
          userId: socket.userId,
          message: message.trim(),
          // sportClubId: socket.sportClubId
          sportClubId: data.sportClubId,
        };

        const savedMessage = await ChatService.addMessageToChat(chatData);

        io.to(socket.currentRoom).emit("NEW_MESSAGE", {
          ...savedMessage.toJSON(),
          user: savedMessage.user,
        });

        console.log(
          `Новое сообщение от ${socket.user.userName} в комнате ${socket.currentRoom}`
        );
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
        socket.emit("error", { message: "Ошибка при отправке сообщения" });
      }
    });

    // Обновление сообщения
    socket.on("UPDATE_MESSAGE", async (data) => {
      try {
        if (!socket.currentRoom) {
          socket.emit("error", { message: "Не присоединены к чату" });
          return;
        }

        const { id, message } = data;

        if (
          !id ||
          !message ||
          typeof message !== "string" ||
          message.trim() === ""
        ) {
          socket.emit("error", { message: "ID и сообщение обязательны" });
          return;
        }

        // Обновляем сообщение в БД
        const updateData = {
          message: message.trim(),
          sportClubId: socket.sportClubId,
        };

        const updatedMessage = await ChatService.updateMessageInChat(
          id,
          updateData
        );

        // Отправляем обновленное сообщение всем пользователям в комнате
        io.to(socket.currentRoom).emit("UPDATE_MESSAGE", {
          ...updatedMessage.toJSON(),
          user: updatedMessage.user,
        });

        console.log(
          `Сообщение ${id} обновлено пользователем ${socket.user.userName}`
        );
      } catch (error) {
        console.error("Ошибка при обновлении сообщения:", error);
        socket.emit("error", { message: "Ошибка при обновлении сообщения" });
      }
    });

    // Удаление сообщения
    socket.on("DELETE_MESSAGE", async (data) => {
      try {
        if (!socket.currentRoom) {
          socket.emit("error", { message: "Не присоединены к чату" });
          return;
        }

        const { id } = data;

        if (!id) {
          socket.emit("error", { message: "ID сообщения обязателен" });
          return;
        }

        // Удаляем сообщение из БД
        await ChatService.deleteMessageFromChat(id);

        // Уведомляем всех пользователей в комнате об удалении
        io.to(socket.currentRoom).emit("DELETE_MESSAGE", { id });

        console.log(
          `Сообщение ${id} удалено пользователем ${socket.user.userName}`
        );
      } catch (error) {
        console.error("Ошибка при удалении сообщения:", error);
        socket.emit("error", { message: "Ошибка при удалении сообщения" });
      }
    });

    // Обработка отключения пользователя
    socket.on("disconnect", () => {
      console.log(
        `Пользователь ${socket.user?.userName} отключился: ${socket.id}`
      );

      if (socket.currentRoom && connectedUsers.has(socket.currentRoom)) {
        // Удаляем пользователя из комнаты
        connectedUsers.get(socket.currentRoom).delete(socket.id);

        // Если комната пуста, удаляем её
        if (connectedUsers.get(socket.currentRoom).size === 0) {
          connectedUsers.delete(socket.currentRoom);
        } else {
          // Уведомляем других пользователей об отключении
          socket.to(socket.currentRoom).emit("user-left-chat", {
            userId: socket.userId,
            userName: socket.user?.userName,
            timestamp: new Date(),
          });
        }
      }
    });
  });

  return io;
}

function getGlobalIo() {
  return globalIo;
}

module.exports = { setupWebsockets, getGlobalIo };
