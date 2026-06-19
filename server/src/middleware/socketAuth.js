const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  try {
    // Получаем токен из handshake query или headers
    const token = socket.handshake.auth.token;
    console.log(socket.handshake.auth.token, "66666666666666666666666666");
    if (!token) {
      return next(new Error("Токен не предоставлен"));
    }

    // Проверяем токен (используем ACCESS_TOKEN_SECRET вместо REFRESH_TOKEN_SECRET)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Добавляем информацию о пользователе к socket
    socket.user = decoded.user;
    socket.userId = decoded.user.id;

    console.log(
      `Пользователь ${decoded.user.userName} (ID: ${decoded.user.id}) подключился к WebSocket`
    );

    next();
  } catch (error) {
    console.error("Ошибка аутентификации WebSocket:", error.message);
    next(new Error("Недействительный токен"));
  }
};

module.exports = socketAuth;
